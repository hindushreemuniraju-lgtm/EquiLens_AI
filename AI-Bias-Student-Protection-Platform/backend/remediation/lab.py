import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional, Tuple
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from fairlearn.reductions import ExponentiatedGradient, DemographicParity, EqualizedOdds
from fairlearn.postprocessing import ThresholdOptimizer

from fairness.metrics import calculate_fairness_scorecard

class RemediationLab:
    def __init__(
        self,
        df: pd.DataFrame,
        feature_cols: List[str],
        protected_col: str,
        target_col: str,
        test_size: float = 0.25,
        random_state: int = 42
    ):
        self.df = df
        self.feature_cols = feature_cols
        self.protected_col = protected_col
        self.target_col = target_col
        self.random_state = random_state

        # Ensure no protected attributes in feature list
        self.feature_cols = [c for c in feature_cols if c != protected_col]

        # Split train/test
        self.X = df[self.feature_cols]
        self.y = df[target_col].to_numpy()
        self.A = df[protected_col].to_numpy()

        (
            self.X_train, self.X_test,
            self.y_train, self.y_test,
            self.A_train, self.A_test
        ) = train_test_split(
            self.X, self.y, self.A,
            test_size=test_size,
            random_state=random_state,
            stratify=self.A
        )

        # Baseline Model (unconstrained Random Forest)
        self.baseline_model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=random_state)
        self.baseline_model.fit(self.X_train, self.y_train)

    def evaluate_model_pipeline(self, model, X_test: pd.DataFrame, y_test: np.ndarray, A_test: np.ndarray, is_postprocessed: bool = False, optimizer = None) -> Dict[str, Any]:
        """Compute performance and fairness metrics for any model."""
        if is_postprocessed and optimizer is not None:
            preds = optimizer.predict(X_test, sensitive_features=A_test)
        else:
            preds = model.predict(X_test)

        acc = float(accuracy_score(y_test, preds))
        prec = float(precision_score(y_test, preds, zero_division=0))
        rec = float(recall_score(y_test, preds, zero_division=0))
        f1 = float(f1_score(y_test, preds, zero_division=0))

        eval_df = pd.DataFrame({
            self.protected_col: A_test,
            "target": y_test,
            "prediction": preds
        })

        fairness = calculate_fairness_scorecard(
            eval_df,
            protected_attr=self.protected_col,
            target_col="target",
            pred_col="prediction"
        )

        return {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "fairness": fairness
        }

    def run_baseline(self) -> Dict[str, Any]:
        """Run baseline evaluation without any mitigation."""
        return self.evaluate_model_pipeline(
            self.baseline_model,
            self.X_test,
            self.y_test,
            self.A_test
        )

    def run_preprocessing_reweighting(self) -> Dict[str, Any]:
        """
        PRE-PROCESSING: Sample Reweighting
        Calculates sample weights inversely proportional to subgroup & outcome representation.
        """
        # Calculate group-conditional weights
        group_counts = {}
        for a, y in zip(self.A_train, self.y_train):
            key = (a, y)
            group_counts[key] = group_counts.get(key, 0) + 1

        n_samples = len(self.A_train)
        n_classes = len(np.unique(self.y_train))
        n_groups = len(np.unique(self.A_train))
        expected_count = n_samples / (n_classes * n_groups)

        sample_weights = np.array([
            expected_count / group_counts[(a, y)]
            for a, y in zip(self.A_train, self.y_train)
        ])

        # Train model with sample weights
        mitigated_model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=self.random_state)
        mitigated_model.fit(self.X_train, self.y_train, sample_weight=sample_weights)

        results = self.evaluate_model_pipeline(
            mitigated_model,
            self.X_test,
            self.y_test,
            self.A_test
        )
        results["technique"] = "Sample Reweighting (Pre-Processing)"
        results["description"] = "Inverse-propensity sample reweighting applied across demographic subgroups prior to model training."
        return results

    def run_inprocessing_adversarial(self, constraint_type: str = "demographic_parity") -> Dict[str, Any]:
        """
        IN-PROCESSING: Fairness-Constrained Optimization (Exponentiated Gradient)
        Enforces Demographic Parity or Equalized Odds mathematical constraints during training.
        """
        estimator = LogisticRegression(solver="liblinear", max_iter=200, random_state=self.random_state)
        
        if constraint_type == "equalized_odds":
            constraint = EqualizedOdds()
        else:
            constraint = DemographicParity()

        mitigator = ExponentiatedGradient(
            estimator=estimator,
            constraints=constraint,
            eps=0.01,
            max_iter=50
        )

        mitigator.fit(self.X_train, self.y_train, sensitive_features=self.A_train)

        results = self.evaluate_model_pipeline(
            mitigator,
            self.X_test,
            self.y_test,
            self.A_test
        )
        results["technique"] = f"Constrained Optimization ({constraint_type.replace('_', ' ').title()})"
        results["description"] = "Exponentiated gradient optimization with mathematical demographic parity penalization during representation learning."
        return results

    def run_postprocessing_threshold(self, objective: str = "equalized_odds") -> Dict[str, Any]:
        """
        POST-PROCESSING: Group-Specific Threshold Calibration
        Calibrates optimal decision thresholds per demographic cohort to equalize opportunity.
        """
        optimizer = ThresholdOptimizer(
            estimator=self.baseline_model,
            constraints="equalized_odds" if objective == "equalized_odds" else "demographic_parity",
            prefit=True,
            predict_method="predict_proba"
        )

        optimizer.fit(self.X_train, self.y_train, sensitive_features=self.A_train)

        results = self.evaluate_model_pipeline(
            self.baseline_model,
            self.X_test,
            self.y_test,
            self.A_test,
            is_postprocessed=True,
            optimizer=optimizer
        )
        results["technique"] = f"Dynamic Group-Specific Threshold Calibration ({objective.replace('_', ' ').title()})"
        results["description"] = "Calibrated group decision cutoffs applied at the decision layer to balance false positive and negative rates without retraining."
        return results

    def generate_pareto_tradeoff_curve(self) -> List[Dict[str, Any]]:
        """
        Calculates Pareto efficiency trade-off curve across varying constraint strengths.
        """
        tradeoff_points = []
        # Simulate varying constraint epsilon values
        eps_values = [0.005, 0.01, 0.02, 0.05, 0.1, 0.2]
        for eps in eps_values:
            try:
                est = LogisticRegression(solver="liblinear", max_iter=100)
                mit = ExponentiatedGradient(est, DemographicParity(), eps=eps, max_iter=25)
                mit.fit(self.X_train, self.y_train, sensitive_features=self.A_train)
                res = self.evaluate_model_pipeline(mit, self.X_test, self.y_test, self.A_test)
                tradeoff_points.append({
                    "epsilon": eps,
                    "accuracy": res["accuracy"],
                    "f1_score": res["f1_score"],
                    "demographic_parity_ratio": res["fairness"]["metrics"]["demographic_parity_ratio"],
                    "equal_opportunity_difference": res["fairness"]["metrics"]["equal_opportunity_difference"],
                    "executive_fairness_score": res["fairness"]["metrics"]["executive_fairness_score"]
                })
            except Exception:
                continue

        return tradeoff_points
