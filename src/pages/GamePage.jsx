import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Check, X, Trophy, Star, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from '../components/Confetti'

export default function GamePage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const { student, refreshStudent } = useAuthStore()
  
  const [subject, setSubject] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameSession, setGameSession] = useState(null)
  const [answers, setAnswers] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    loadGameData()
  }, [subjectId])

  const loadGameData = async () => {
    try {
      // Load subject
      const { data: subjectData } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .single()
      setSubject(subjectData)

      // Load questions (5 random questions)
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .eq('subject_id', subjectId)
        .limit(5)
      
      // Shuffle questions
      const shuffled = questionsData?.sort(() => Math.random() - 0.5) || []
      setQuestions(shuffled)

      // Create game session
      if (student?.id) {
        const { data: sessionData } = await supabase
          .from('game_sessions')
          .insert({
            student_id: student.id,
            subject_id: subjectId,
            total_questions: shuffled.length,
            answers: []
          })
          .select()
          .single()
        setGameSession(sessionData)
      }
    } catch (error) {
      console.error('Error loading game:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answer) => {
    if (showExplanation) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct_answer
    
    // Update score
    if (isCorrect) {
      setScore(score + currentQuestion.points_value)
      setCorrectAnswers(correctAnswers + 1)
    }

    // Record answer
    const answerRecord = {
      question_id: currentQuestion.id,
      question_text: currentQuestion.question_text,
      selected_answer: selectedAnswer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: isCorrect,
      points_earned: isCorrect ? currentQuestion.points_value : 0
    }
    setAnswers([...answers, answerRecord])

    setShowExplanation(true)
  }

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Game complete
      await completeGame()
    }
  }

  const completeGame = async () => {
    try {
      // Update game session
      await supabase
        .from('game_sessions')
        .update({
          correct_answers: correctAnswers,
          total_points_earned: score,
          completed_at: new Date().toISOString(),
          answers: answers
        })
        .eq('id', gameSession.id)

      // Update student stats
      const newTotalPoints = (student?.total_points || 0) + score
      const newLevel = Math.floor(newTotalPoints / 100) + 1
      
      await supabase
        .from('students')
        .update({
          total_points: newTotalPoints,
          current_level: newLevel,
          total_study_time: (student?.total_study_time || 0) + 5 // Assume 5 minutes per game
        })
        .eq('id', student.id)

      // Check and award achievements
      await checkAchievements(newTotalPoints)

      // Refresh student data
      await refreshStudent()

      setGameComplete(true)
      setShowConfetti(true)
    } catch (error) {
      console.error('Error completing game:', error)
    }
  }

  const checkAchievements = async (totalPoints) => {
    try {
      // Get all achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')

      // Get already earned achievements
      const { data: earnedAchievements } = await supabase
        .from('student_achievements')
        .select('achievement_id')
        .eq('student_id', student.id)

      const earnedIds = earnedAchievements?.map(ea => ea.achievement_id) || []

      // Check each achievement
      for (const achievement of achievements || []) {
        if (earnedIds.includes(achievement.id)) continue

        let shouldAward = false

        switch (achievement.requirement_type) {
          case 'points':
            shouldAward = totalPoints >= achievement.requirement_value
            break
          case 'games_played':
            const { count } = await supabase
              .from('game_sessions')
              .select('*', { count: 'exact', head: true })
              .eq('student_id', student.id)
              .not('completed_at', 'is', null)
            shouldAward = count >= achievement.requirement_value
            break
          case 'streak':
            shouldAward = (student?.current_streak || 0) >= achievement.requirement_value
            break
        }

        if (shouldAward) {
          await supabase
            .from('student_achievements')
            .insert({
              student_id: student.id,
              achievement_id: achievement.id
            })
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat game...</p>
        </div>
      </div>
    )
  }

  if (gameComplete) {
    return <GameComplete score={score} totalQuestions={questions.length} correctAnswers={correctAnswers} showConfetti={showConfetti} />
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </motion.button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-gray-700">
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </span>
            <span className="text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-primary-orange to-primary-pink h-3 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card mb-6"
          >
            <div className="text-4xl mb-4 text-center">{subject?.icon}</div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {currentQuestion?.question_text}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedAnswer === option
                const isCorrect = option === currentQuestion.correct_answer
                const showResult = showExplanation

                let bgColor = 'bg-white hover:bg-gray-50'
                let borderColor = 'border-gray-200'
                
                if (showResult) {
                  if (isCorrect) {
                    bgColor = 'bg-green-50'
                    borderColor = 'border-green-500'
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-red-50'
                    borderColor = 'border-red-500'
                  }
                } else if (isSelected) {
                  bgColor = 'bg-blue-50'
                  borderColor = 'border-blue-500'
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                    whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-xl border-2 ${borderColor} ${bgColor} text-left font-semibold transition-all flex items-center justify-between`}
                  >
                    <span>{option}</span>
                    {showResult && isCorrect && (
                      <Check className="w-6 h-6 text-green-600" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-xl mb-4 ${
                    selectedAnswer === currentQuestion.correct_answer
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-red-50 border-2 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {selectedAnswer === currentQuestion.correct_answer ? (
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <Check className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="bg-red-500 text-white p-2 rounded-full">
                        <X className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold mb-2">
                        {selectedAnswer === currentQuestion.correct_answer
                          ? '🎉 Benar! Kamu hebat!'
                          : '💡 Penjelasan:'}
                      </h4>
                      <p className="text-gray-700">{currentQuestion.explanation}</p>
                      {selectedAnswer === currentQuestion.correct_answer && (
                        <p className="text-green-700 font-semibold mt-2">
                          +{currentQuestion.points_value} poin!
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!showExplanation ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className={`w-full btn-primary ${!selectedAnswer && 'opacity-50 cursor-not-allowed'}`}
                >
                  Jawab
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextQuestion}
                  className="w-full btn-primary"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Lanjut' : 'Selesai'}
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function GameComplete({ score, totalQuestions, correctAnswers, showConfetti }) {
  const navigate = useNavigate()
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="card text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-orange to-primary-pink bg-clip-text text-transparent">
            Selamat!
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Kamu telah menyelesaikan game ini!
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-xl">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{score}</div>
              <div className="text-sm text-gray-600">Poin</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{correctAnswers}/{totalQuestions}</div>
              <div className="text-sm text-gray-600">Benar</div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-xl">
              <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
              <div className="text-sm text-gray-600">Akurasi</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="w-full btn-primary"
          >
            Kembali ke Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
