"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, FileUp, Languages, ArrowRightLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

// Define the SpeechRecognition interface
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "hi", name: "Hindi" },
  { code: "uk", name: "Ukrainian" },
]

const API_URL = 'https://api.mymemory.translated.net/get'

export function TranslatorHero() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [activeTab, setActiveTab] = useState("text")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const handleTranslate = async (text: string) => {
    if (!text) return

    setIsTranslating(true)

    try {
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`)
      const data = await response.json()

      if (data.responseStatus === 200) {
        setTranslatedText(data.responseData.translatedText)
      } else {
        setTranslatedText("Translation failed. Please try again.")
      }
    } catch (error) {
      console.error('Translation error:', error)
      setTranslatedText("An error occurred during translation. Please try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleVoiceTranslate = () => {
    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = sourceLanguage

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('')
          setSourceText(transcript)
        }

        recognitionRef.current.onerror = (event: SpeechRecognitionEvent) => {
          console.error('Speech recognition error', event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.start()
        setIsListening(true)
      } else {
        alert('Speech recognition is not supported in your browser.')
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        setIsListening(false)
        handleTranslate(sourceText)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          setSourceText(text)
          await handleTranslate(text)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <section className="relative py-20 overflow-hidden bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              PolyLingual Translator
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Translate anything, anywhere. Powered by MyMemory for accurate translations across multiple languages.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Created by Ashutosh Singh
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <Tabs defaultValue="text" className="p-6" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                File
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Select defaultValue={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger aria-label="Select source language">
                    <SelectValue placeholder="Select source language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Enter text to translate..."
                  className="min-h-[200px]"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  aria-label="Source text"
                />
              </div>

              <div className="space-y-4">
                <Select defaultValue={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger aria-label="Select target language">
                    <SelectValue placeholder="Select target language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Translation will appear here..."
                  className="min-h-[200px]"
                  value={translatedText}
                  readOnly
                  aria-label="Translated text"
                />
              </div>
            </div>

            <TabsContent value="voice" className="mt-4">
              <div className="space-y-4 text-center">
                <p>Click the button to start/stop voice recognition</p>
                <Button onClick={handleVoiceTranslate} className="gap-2">
                  <Mic className="h-4 w-4" />
                  {isListening ? "Stop Listening" : "Start Listening"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="file" className="mt-4">
              <div className="space-y-4 text-center">
                <p>Upload a text file to translate its content</p>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt"
                  className="mx-auto max-w-xs"
                />
              </div>
            </TabsContent>

            <div className="flex justify-center mt-6">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => handleTranslate(sourceText)}
                disabled={isTranslating || !sourceText}
              >
                {isTranslating ? (
                  "Translating..."
                ) : (
                  <>
                    <ArrowRightLeft className="h-4 w-4" />
                    Translate
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </Card>
      </div>
    </section>
  )
}
