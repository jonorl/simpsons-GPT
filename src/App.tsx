import { useState, useEffect } from 'react';
import { Loader2, Sparkles, MapPin, User, MessageSquare, AlertCircle, Power } from 'lucide-react';
import { SiHuggingface } from "react-icons/si";

const LOADING_MESSAGES = [
  "Waking up the free-tier server...",
  "Loading GPT-2 model weights...",
  "Connecting to Hugging Face Spaces...",
  "Preparing character context...",
  "Setting scene location...",
  "Fine-tuning generation parameters...",
  "Generating authentic Simpsons dialogue...",
  "Almost there..."
];

export default function SimpsonsGenerator() {
  const [character, setCharacter] = useState('Homer Simpson');
  const [location, setLocation] = useState('Simpson Home');
  const [promptWord, setPromptWord] = useState('hey');
  const [temperature, setTemperature] = useState(0.8);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.9);
  const [maxLength, setMaxLength] = useState(100);
  const [numOutputs, setNumOutputs] = useState(1);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.2);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [spaceStatus, setSpaceStatus] = useState<'checking' | 'ready' | 'sleeping' | 'error'>('checking');
  const [wakingUp, setWakingUp] = useState(false);

  interface Example {
    character: string;
    location: string;
    prompt: string;
  }

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;

    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, [loading]);

  // Check space status on mount
  useEffect(() => {
    checkSpaceStatus();
  }, []);

  const checkSpaceStatus = async () => {
    setSpaceStatus("checking");
    try {
      const { Client } = await import("@gradio/client");
      await Client.connect("jonorl/simpsons", {
        token: import.meta.env.VITE_HF_TOKEN,
      });
      setSpaceStatus("ready");
    } catch (err) {
      console.error("Status check error:", err);
      setSpaceStatus("sleeping");
    }
  };

  const wakeUpSpace = async () => {
    setWakingUp(true);
    try {
      const { Client } = await import("@gradio/client");
      await Client.connect("jonorl/simpsons", {
        token: import.meta.env.VITE_HF_TOKEN,
      });
      setSpaceStatus("ready");
    } catch (err) {
      console.error("Wake up error:", err);
      setSpaceStatus("error");
    } finally {
      setWakingUp(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    try {
      // Import Gradio client dynamically
      const { Client } = await import("@gradio/client");

      const client = await Client.connect("jonorl/simpsons", {
        token: import.meta.env.VITE_HF_TOKEN,
      });

      const result = await client.predict("/generate_dialogue", {
        character: character,
        location: location,
        prompt_word: promptWord,
        temperature: temperature,
        top_k: topK,
        top_p: topP,
        max_length: maxLength,
        num_outputs: numOutputs,
        repetition_penalty: repetitionPenalty,
      });

      // Extract the result
      const generatedText = result.data as string;

      if (generatedText) {
        setOutput(generatedText);
        setSpaceStatus("ready");
      } else {
        setError('No output generated. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate dialogue. Please try again later.');
      console.error("Connection Error:", err);
      setSpaceStatus("sleeping");
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    { character: 'Homer Simpson', location: 'Power Plant', prompt: 'nuclear' },
    { character: 'Bart Simpson', location: 'Springfield Elementary', prompt: 'school' },
    { character: 'Marge Simpson', location: 'Simpson Home', prompt: 'family' },
    { character: 'Mr. Burns', location: 'Power Plant', prompt: 'excellent' },
    { character: 'Lisa Simpson', location: 'School', prompt: 'saxophone' }
  ];

  const loadExample = (example: Example) => {
    setCharacter(example.character);
    setLocation(example.location);
    setPromptWord(example.prompt);
  };

  const getStatusColor = () => {
    switch (spaceStatus) {
      case "ready":
        return "bg-green-900/30 border-green-700/50 text-green-300";
      case "sleeping":
        return "bg-yellow-900/30 border-yellow-700/50 text-yellow-300";
      case "checking":
        return "bg-blue-900/30 border-blue-700/50 text-blue-300";
      case "error":
        return "bg-red-900/30 border-red-700/50 text-red-300";
    }
  };

  const getStatusIcon = () => {
    switch (spaceStatus) {
      case "ready":
        return <Power className="w-4 h-4" />;
      case "sleeping":
        return <AlertCircle className="w-4 h-4" />;
      case "checking":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (spaceStatus) {
      case "ready":
        return "Model Ready";
      case "sleeping":
        return "Model Sleeping";
      case "checking":
        return "Checking Status...";
      case "error":
        return "Connection Error";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">
            🍩 Simpsons Dialogue Generator
          </h1>
          <p className="text-xl text-gray-300">
            AI-Powered Character Dialogue Generation
          </p>
        </div>

        {/* Project Description */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">About This Project</h2>

          <div className="space-y-4 text-gray-300">
            <p className="text-lg leading-relaxed">
              This project demonstrates the power of fine-tuned language models for creative text generation.
              I trained a GPT-2 model on thousands of Simpsons dialogue samples (seasons 1-10 obviously) to generate
              something close to authentic-sounding conversations from the iconic TV show.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-yellow-900/20 rounded-lg p-6 border border-yellow-700/30">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Technical Approach</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong className="text-gray-200">Model:</strong> Fine-tuned GPT-2</li>
                  <li>• <strong className="text-gray-200">Framework:</strong> PyTorch & Transformers</li>
                  <li>• <strong className="text-gray-200">Training:</strong> Custom dataset with character/location conditioning</li>
                  <li>• <strong className="text-gray-200">Deployment:</strong> Gradio API on Hugging Face Spaces</li>
                </ul>
              </div>

              <div className="bg-orange-900/20 rounded-lg p-6 border border-orange-700/30">
                <h3 className="text-xl font-semibold text-orange-400 mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Context-aware dialogue generation</li>
                  <li>• Character personality preservation</li>
                  <li>• Location-based scene setting</li>
                  <li>• Adjustable creativity parameters</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-900/20 rounded-lg p-6 mt-6 border border-blue-700/30">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">How It Works</h3>
              <p className="text-gray-300">
                The model uses a special input format: <code className="bg-gray-900 px-2 py-1 rounded text-sm text-green-400">[CHAR:Character][LOC:Location][PROMPT:Word]</code>.
                This conditioning mechanism allows the model to generate dialogue that matches the specified character's
                personality and the scene's context. The temperature and sampling parameters give you control over how
                creative or conservative the output is.
              </p>
            </div>
          </div>
        </div>

        {/* Hardware Limitations Section */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-gray-100">Before you try it...</h2>
          </div>

          <div className="space-y-4 text-gray-300">
            <p className="text-lg leading-relaxed">
              Bear in mind that the output might seem a bit... abstract, even nonsensical. That's because this project was specifically designed
              as a learning exercise in training language models on <strong className="text-gray-200">local hardware</strong> -
              my personal PC (i5 13400F + 32GB RAM + 6950XT GPU).
            </p>

            <div className="bg-red-900/20 rounded-lg p-6 border border-red-700/30">
              <h3 className="text-xl font-semibold text-red-400 mb-3">The Reality of Local Training</h3>
              <p className="text-gray-300 mb-4">
                Mainstream LLMs like ChatGPT, Claude or Grok are trained on massive GPU clusters with thousands of
                high-end processors, terabytes of RAM, and weeks or months of continuous training. They're trained on
                billions of parameters with enormous datasets.
              </p>
              <p className="text-gray-300">
                This project? Trained on a gaming-focused GPU with limited memory and computing power. The goal wasn't
                to compete with industry giants, but to understand the fundamentals of fine-tuning language models,
                dataset preparation, and deployment - all with the resources available to an individual developer.
              </p>
            </div>

            <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-700/30">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">What I Learned</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong className="text-gray-200">Setting up:</strong> Configuring ROCm for a RDNA2 GPU was... challenging to say the least, not to mention the dozen of dependencies not built for this hardware</li>
                <li>• <strong className="text-gray-200">Model architecture:</strong> How transformers work under the hood</li>
                <li>• <strong className="text-gray-200">Training constraints:</strong> Balancing quality vs. computational limits</li>
                <li>• <strong className="text-gray-200">Data preprocessing:</strong> Creating structured training data from raw tabular data</li>
                <li>• <strong className="text-gray-200">Deployment:</strong> Hosting and serving models through APIs. Especially large models hosted on Hugging Face</li>
                <li>• <strong className="text-gray-200">Realistic expectations:</strong> Understanding the resource gap between hobbyist and production AI</li>
              </ul>
            </div>

            <p className="text-sm text-gray-400 italic">
              Think of this as a proof-of-concept that demonstrates the process, not the performance. The "gibberish"
              is actually the model trying its best with the limited training it received!
            </p>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`rounded-2xl p-6 mb-8 border-2 ${getStatusColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium text-sm">{getStatusText()}</span>
            </div>
            {spaceStatus === "sleeping" && !wakingUp && (
              <button
                onClick={wakeUpSpace}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Wake Up Model
              </button>
            )}
            {wakingUp && (
              <span className="text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waking up model...
              </span>
            )}
          </div>
          {spaceStatus === "sleeping" && (
            <p className="text-sm mt-3 opacity-90">
              The AI model is currently sleeping. Click the button above to wake it up (this may take 30-60 seconds).
            </p>
          )}
        </div>

        {/* Interactive Demo */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">Try It Yourself</h2>

          {/* Quick Examples */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-400 mb-3">Quick Examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(example)}
                  className="px-4 py-2 bg-yellow-900/30 hover:bg-yellow-800/40 text-yellow-300 rounded-lg text-sm font-medium transition-colors border border-yellow-700/50"
                >
                  {example.character} @ {example.location}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                  <User className="w-4 h-4" />
                  Character Name
                </label>
                <input
                  type="text"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-100 placeholder-gray-500"
                  placeholder="e.g., Homer Simpson"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-100 placeholder-gray-500"
                  placeholder="e.g., Power Plant"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Prompt Word
                </label>
                <input
                  type="text"
                  value={promptWord}
                  onChange={(e) => setPromptWord(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-100 placeholder-gray-500"
                  placeholder="e.g., nuclear, doh, beer"
                />
              </div>

              {/* Advanced Settings */}
              <div className="pt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                >
                  {showAdvanced ? '− Hide' : '+ Show'} Advanced Settings
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Temperature: {temperature}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Top-k: {topK}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={topK}
                      onChange={(e) => setTopK(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Top-p: {topP}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Max Length: {maxLength}
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      step="10"
                      value={maxLength}
                      onChange={(e) => setMaxLength(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Number of Outputs: {numOutputs}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={numOutputs}
                      onChange={(e) => setNumOutputs(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Repetition Penalty: {repetitionPenalty}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="0.1"
                      value={repetitionPenalty}
                      onChange={(e) => setRepetitionPenalty(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || spaceStatus !== "ready"}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Dialogue
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">
                Generated Dialogue
              </label>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 min-h-[400px] border-2 border-gray-700">
                {loading && (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
                    <div className="text-center">
                      <p className="text-gray-300 font-medium transition-opacity duration-300">
                        {loadingMessage}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        First load may take 30-60 seconds
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {output && !loading && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                      {output}
                    </div>
                  </div>
                )}

                {!loading && !error && !output && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Your generated dialogue will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-400">
              Built with PyTorch, Transformers, Gradio, and React • Model hosted on Hugging Face Spaces
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a
                href="https://jonathan-orlowski.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Jonathan Orlowski
              </a>
              <a
                href="https://github.com/jonorl/simpsons-GPT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
                            <a
                href="https://huggingface.co/spaces/jonorl/simpsons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"
              >
                <SiHuggingface className="mb-1" aria-label="HuggingFace" />
                Hugging Face
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}