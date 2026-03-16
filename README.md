# AI Health Diagnostic Chatbot 🩺

An intelligent medical diagnosis chatbot built on **Google Dialogflow** that simulates human-like clinical reasoning. This project explores the fusion of symbolic logic and probabilistic models to handle medical uncertainty and conflicting symptoms.

---

## 🧠 Core Methodology

This chatbot is not a simple decision tree. It implements a sophisticated reasoning engine based on established research in decision-making under uncertainty.

### 1. Symbolic Argumentation
Based on research by *S. Das (2005)*, the bot treats each symptom as an "argument" for or against a specific diagnosis. Each argument is assigned a "degree of belief" or strength.

### 2. Dempster-Shafer Theory (DST)
To aggregate evidence and manage the relationship between "for" and "against" arguments, the system implements **Dempster-Shafer Theory**. This provides a robust mathematical framework for evidence combination.
* *G. Shafer (1976): A Mathematical Theory of Evidence.*
* *Fedrizzi et al. (1994): Advances in the Dempster-Shafer Theory of Evidence.*

### 3. The "Phase Police" (Innovation)
This project introduces an innovative technique called **Phase Police**. It categorizes clinical questions into phases based on relevancy: **High**, **Medium**, and **Low**. 
* **Optimized Dialogue:** Results show that this fusion allows the bot to reach a diagnosis in fewer utterances compared to standard linear questioning.
* **Clinical Simulation:** The process mimics a human clinician by prioritizing the most presenting symptoms first.

---

## 🧪 Test Scenario & Logic

The engine was tested using a **Frame of Discernment** ($\Omega$) consisting of three tropical diseases: `{‘malaria’, ‘dengue’, 'chikungunya'}`.

### Argument Mapping
| Symptom | Argument Constraint | Strength | Logical Implication |
| :--- | :--- | :--- | :--- |
| **Headache** | *Not Malaria* | 0.7 | Implies ‘dengue’ or 'chikungunya' |
| **Nausea** | *Not Chikungunya* | 0.6 | Implies ‘malaria’ or 'dengue' |
| **Joint Pain** | *Chikungunya* | 0.8 | Specific evidence for Chikungunya |

**Result:** In this specific scenario, the engine calculates a **61% belief score** for **Chikungunya**.

---

## 🛠️ Platform
* **Google Dialogflow:** Used for Natural Language Understanding (NLU) and conversation management.
* **Logic Engine:** Custom implementation of DST and Phase Police filtering.

---

## 📚 References
* S. Das, “Symbolic argumentation for decision making under uncertainty,” in *2005 7th International Conference on Information Fusion*, 2005.
* G. Shafer, *A Mathematical Theory of Evidence*, Princeton University Press, 1976.

