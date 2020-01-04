# AiHealthDiagnosisChatbot

This is an AI Health Chat bot built on Dialogflow platform.

This project builds a chatbot for medical diagnosis based on patient symptoms. It implements symbolic argumentation framework where each argument has a degree of belief or strength. To aggregate the argumentation system of for and against relationship, Dempster-Shafer theory is implemented. Basically, the whole approach is the combination of symbolic arguments and probabilistic model, which has been proven in several research to be effective. Dempster-Shafer theory is fused with an innovative technique called as phase police. It drives the chatbot to ask questions from the user in different phases. With this fusion of techniques, the reasoning process of diagnosing was simulated similar to a human clinician and results show that in some scenarios it was possible to diagnose a disease in a smaller number of utterances.

1. Symbolic Argumentation (S. Das, “Symbolic argumentation for decision making under uncertainty,” in 2005 7th International Conference on Information Fusion, FUSION, 2005. ) 

2. Dempster-Shafer Theory :
a. G. Shafer, “A Mathematical Theory of Evidence,” Princeton University Press. Princeton,NJ, 1976.
b M. Fedrizzi, J. Kacprzyk, and R. R. Yager, Eds., Advances in the Dempster-Shafer Theory of Evidence. John Wiley & Sons, 1994.

3. Phase Police: This approach divides the clinical questions in different phases based on the relevancy high, medium and low. This division is subjective and based on the family of disease and requires a doctor to factor the symptoms based on the relevancy.
