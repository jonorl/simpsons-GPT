# Simpsons Dialogue Generator

An AI-powered web application that generates something close to authentic-sounding dialogue from The Simpsons using a fine-tuned GPT-2 language model.

## Project Overview

This project demonstrates the complete machine learning workflow from data preparation to deployment, showcasing how to fine-tune a language model on a custom dataset using consumer-grade hardware. The model generates character-specific dialogue that captures the personality and speaking style of iconic Simpsons characters.

**Model**: [Hugging Face Space](https://huggingface.co/spaces/jonorl/simpsons)

## Features

### Interactive Web Interface
- **Character Selection**: Choose from various Simpsons characters
- **Location Context**: Set the scene with different Springfield locations
- **Prompt Words**: Guide the dialogue generation with starter words
- **Advanced Parameters**: Fine-tune generation with adjustable settings
  - Temperature (creativity level)
  - Top-k and Top-p sampling
  - Maximum output length
  - Number of outputs
  - Repetition penalty

## Technical Stack

### Machine Learning
- **Model**: GPT-2 (124M parameters)
- **Framework**: PyTorch + Hugging Face Transformers
- **Training Hardware**: AMD Radeon RX 6950 XT GPU (16GB VRAM)
  - CPU: Intel i5-13400F
  - RAM: 32GB DDR4
  - OS: Linux Mint(22.3 Zena)

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Client**: Gradio Client

### Deployment
- **Model Hosting**: Hugging Face Spaces (Gradio)
- **Frontend**: Cloudflare
- **Architecture**: Serverless API calls to Hugging Face

## How It Works

### Training Process
1. **Dataset Preparation**: Collected and structured thousands of Simpsons dialogue samples from [Kaggle](https://www.kaggle.com/datasets/prashant111/the-simpsons-dataset)
2. **Data Format**: Custom conditioning format: `[CHAR:Name][LOC:Location][PROMPT:Word]`
3. **Fine-tuning**: Trained GPT-2 on local hardware with character/location awareness
4. **Evaluation**: Tested for personality consistency and contextual relevance

### Inference Pipeline
1. User selects character, location, and prompt word
2. Frontend formats input with special tokens
3. Request sent to Hugging Face Gradio API
4. Model generates dialogue using configured sampling parameters
5. Response displayed with formatted output

### Special Features
- **Context Conditioning**: Model learns to associate characters with their speech patterns
- **Location Awareness**: Setting influences dialogue topics and references
- **Controlled Generation**: Multiple parameters allow fine-grained output control

## Learning Outcomes

This project was designed as a comprehensive learning exercise in:

### Hardware & Infrastructure
- Configuring AMD ROCm for deep learning on RDNA2 architecture
- Managing GPU memory constraints during training
- Optimizing training pipelines for consumer hardware

### Machine Learning Engineering
- Fine-tuning pretrained language models
- Custom tokenization and data preprocessing
- Implementing conditional text generation
- Hyperparameter tuning and experimentation

### Full-Stack Development
- Building responsive React applications
- Integrating ML models via REST APIs
- Managing asynchronous operations and loading states
- Deploying serverless ML applications

### Realistic Expectations
- Understanding the resource gap between hobby projects and production AI
- Learning to work within hardware limitations
- Balancing model quality with practical constraints

## Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone the repository
git clone https://github.com/jonorl/simpsons-GPT.git
cd simpsons-GPT

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Setup
The application connects to the Hugging Face Spaces API automatically. No API keys required for basic usage.

## Model Parameters

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|---------|
| Temperature | 0.8 | 0.1-2.0 | Controls randomness |
| Top-k | 50 | 1-100 | Limits vocabulary selection |
| Top-p | 0.9 | 0.1-1.0 | Nucleus sampling threshold |
| Max Length | 100 | 20-200 | Maximum tokens generated |
| Repetition Penalty | 1.2 | 1.0-2.0 | Reduces repeated phrases |

## Known Limitations

### Model Quality
- Trained on consumer hardware, not production-scale infrastructure
- Output may be abstract or nonsensical compared to industry models
- Limited by ~124M parameters vs billions in modern LLMs

### Performance
- Free-tier Hugging Face Spaces has cold start delays
- First request may take 30-60 seconds
- Subsequent requests are faster (server warm)

### Content
- Model trained on TV dialogue, not real-world conversations
- May occasionally generate unexpected combinations
- Best used for demonstration and learning purposes

## License

This project is for educational and portfolio purposes. The Simpsons characters and content are property of 20th Century Fox/Disney.

## Author

**Jonathan Orlowski**

- Portfolio: [Jonathan Orlowski](https://jonathan-orlowski.pages.dev/)

## Acknowledgments

- Prashant Banerjee (prashant111) for the Kaggle Simpsons dataset
- Hugging Face for model hosting and Transformers library
- PyTorch team for the deep learning framework
- Gradio for the deployment interface
- AMD for ROCm GPU support
- The Simpsons for decades of memorable dialogue