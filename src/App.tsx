import { useState } from 'react';
import { Loader2, Sparkles, MapPin, User, MessageSquare } from 'lucide-react';

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

  interface Example {
    character: string;
    location: string;
    prompt: string;
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    try {
      // Import Gradio client dynamically
      const { Client } = await import("@gradio/client");
      
      const client = await Client.connect("jonorl/simpsons");

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
      } else {
        setError('No output generated. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate dialogue. Please try again later.');
      console.error("Connection Error:", err);
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
              I trained a GPT-2 model on thousands of Simpsons dialogue samples to generate authentic-sounding 
              conversations from the iconic TV show.
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
                  {example.character.split(' ')[0]} @ {example.location}
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
                disabled={loading}
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
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
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
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">
            Built with PyTorch, Transformers, Gradio, and React • Model hosted on Hugging Face Spaces
          </p>
        </div>
      </div>
    </div>
  );
}