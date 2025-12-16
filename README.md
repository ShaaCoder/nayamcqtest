# Project Bolt - Quiz Application

A simple and extensible quiz application that tests your knowledge on various subjects. Questions are loaded dynamically from a CSV file, making it easy to add new content.

## 🚀 Features

*   **Interactive Command-Line Interface**: A user-friendly CLI to take the quiz.
*   **Subject Selection**: Allows the user to choose a quiz from the subjects available in the data file (e.g., "Polity").
*   **Dynamic Question Loading**: All questions are loaded directly from `test.csv`, making it easy to add more content.
*   **Immediate Feedback**: Instantly know if your answer was correct or incorrect.
*   **Score Tracking**: Your score is calculated as you go.
*   **Final Results**: See your final score at the end of the quiz.

## 📂 Data Source

The quiz questions are stored in `test.csv`. Each row in the file represents a single question and has the following structure:

| Column          | Description                                                              |
|-----------------|--------------------------------------------------------------------------|
| `question_text` | The text of the question being asked.                                    |
| `option_a`      | The first possible answer (Choice A).                                    |
| `option_b`      | The second possible answer (Choice B).                                   |
| `option_c`      | The third possible answer (Choice C).                                    |
| `option_d`      | The fourth possible answer (Choice D).                                   |
| `correct_index` | The 0-based index of the correct answer (0=A, 1=B, 2=C, 3=D).            |
| `subject`       | The subject or category of the question (e.g., "Polity").                |

### Example:

```csv
question_text,option_a,option_b,option_c,option_d,correct_index,subject
Who is known as the father of the Indian Constitution?,Mahatma Gandhi,Jawaharlal Nehru,Dr. B.R. Ambedkar,Sardar Patel,2,Polity
```

## 🛠️ Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

This project requires Python 3.x. You may also need to install some dependencies.

```sh
# It's recommended to create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### Installation

1.  Clone the repository:
    ```sh
    git clone <your-repository-url>
    cd project-bolt-sb1-fi8wn416
    ```

2.  Install the required packages (if you have a `requirements.txt` file):
    ```sh
    pip install -r requirements.txt
    ```

### Running the Application

Execute the main script to start the quiz:

```sh
python main.py
```

## 🤝 Contributing

Contributions are welcome! The easiest way to contribute is by adding more questions to `test.csv`.

1.  Fork the project.
2.  Add your new questions to `test.csv`, ensuring the format is correct.
3.  Create a new Pull Request.