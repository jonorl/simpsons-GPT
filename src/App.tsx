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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-600 mb-4">
            🍩 Simpsons Dialogue Generator
          </h1>
          <p className="text-xl text-gray-700">
            AI-Powered Character Dialogue Generation
          </p>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Project</h2>
          
          <div className="space-y-4 text-gray-700">
            <p className="text-lg leading-relaxed">
              This project demonstrates the power of fine-tuned language models for creative text generation. 
              I trained a GPT-2 model on thousands of Simpsons dialogue samples to generate authentic-sounding 
              conversations from the iconic TV show.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-700 mb-3">🧠 Technical Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Model:</strong> Fine-tuned GPT-2</li>
                  <li>• <strong>Framework:</strong> PyTorch & Transformers</li>
                  <li>• <strong>Training:</strong> Custom dataset with character/location conditioning</li>
                  <li>• <strong>Deployment:</strong> Gradio API on Hugging Face Spaces</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-orange-700 mb-3">🎯 Key Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Context-aware dialogue generation</li>
                  <li>• Character personality preservation</li>
                  <li>• Location-based scene setting</li>
                  <li>• Adjustable creativity parameters</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">💡 How It Works</h3>
              <p className="text-gray-700">
                The model uses a special input format: <code className="bg-white px-2 py-1 rounded text-sm">[CHAR:Character][LOC:Location][PROMPT:Word]</code>. 
                This conditioning mechanism allows the model to generate dialogue that matches the specified character's 
                personality and the scene's context. The temperature and sampling parameters give you control over how 
                creative or conservative the output is.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Try It Yourself</h2>

          {/* Quick Examples */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-3">Quick Examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(example)}
                  className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium transition-colors"
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Character Name
                </label>
                <input
                  type="text"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g., Homer Simpson"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g., Power Plant"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Prompt Word
                </label>
                <input
                  type="text"
                  value={promptWord}
                  onChange={(e) => setPromptWord(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g., nuclear, doh, beer"
                />
              </div>

              {/* Advanced Settings */}
              <div className="pt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm font-semibold text-yellow-600 hover:text-yellow-700"
                >
                  {showAdvanced ? '− Hide' : '+ Show'} Advanced Settings
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
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
                    <label className="text-sm font-medium text-gray-700">
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
                    <label className="text-sm font-medium text-gray-700">
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
                    <label className="text-sm font-medium text-gray-700">
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
                    <label className="text-sm font-medium text-gray-700">
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
                    <label className="text-sm font-medium text-gray-700">
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
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Generated Dialogue
              </label>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 min-h-[400px] border-2 border-gray-200">
                {loading && (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {output && !loading && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {output}
                    </div>
                  </div>
                )}
                
                {!loading && !error && !output && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Your generated dialogue will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Built with PyTorch, Transformers, Gradio, and React • Model hosted on Hugging Face Spaces
          </p>
        </div>
      </div>
    </div>
  );
}