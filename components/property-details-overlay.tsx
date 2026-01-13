"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Home,
  Bed,
  Bath,
  Square,
  MapPin,
  TrendingUp,
  TrendingDown,
  Wifi,
  Car,
  Thermometer,
  Zap,
  Shield,
  Trees,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Activity,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Calculator,
  DollarSign,
  PiggyBank,
  Info,
  Lightbulb,
  Compass as Compare,
  Plus,
  Minus,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

interface PropertyDetailsOverlayProps {
  isOpen: boolean
  onClose: () => void
  property: {
    id: string
    title: string
    address: string
    price: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
    yearBuilt?: number
    lotSize?: string
    propertyType?: string
    description?: string
    features?: string[]
    systems?: {
      heating?: string
      cooling?: string
      parking?: string
    }
    neighborhood?: {
      name?: string
      walkScore?: number
      transitScore?: number
      bikeScore?: number
    }
    schools?: Array<{
      name: string
      rating: number
      distance: string
    }>
    marketData?: {
      pricePerSqFt?: number
      daysOnMarket?: number
      priceHistory?: Array<{
        date: string
        price: number
        event: string
        change?: number
      }>
      comparableProperties?: Array<{
        address: string
        price: number
        sqft: number
        soldDate: string
      }>
      marketTrends?: {
        averagePriceChange: number
        medianDaysOnMarket: number
        inventoryLevel: string
        priceAppreciation: {
          "1year": number
          "3year": number
          "5year": number
        }
      }
      aiPredictions?: {
        confidenceScore: number
        methodology: string
        lastUpdated: string
        predictions: {
          [key: string]: {
            price: number
            change: number
            confidence: number
            factors: string[]
          }
        }
        riskFactors: Array<{
          factor: string
          impact: string
          probability: string
        }>
        marketDrivers: Array<{
          driver: string
          impact: string
          strength: string
        }>
      }
    }
  }
}

interface MortgageCalculation {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  principalAndInterest: number
  propertyTax: number
  insurance: number
  pmi: number
}

interface AffordabilityAnalysis {
  recommendedIncome: number
  debtToIncomeRatio: number
  affordabilityScore: number
  recommendations: string[]
  riskLevel: string
  monthlyBudgetBreakdown: {
    housing: number
    otherDebts: number
    livingExpenses: number
    savings: number
    discretionary: number
  }
}

interface LoanScenarioBase {
  id: string
  name: string
  downPayment: number
  interestRate: number
  loanTerm: number
  color: string
}

interface LoanScenario extends LoanScenarioBase {
  calculation: MortgageCalculation
}

export function PropertyDetailsOverlay({ isOpen, onClose, property }: PropertyDetailsOverlayProps) {
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["overview"]))

  // Mortgage calculator state
  const [loanAmount, setLoanAmount] = useState(property.price * 0.8) // 20% down payment
  const [downPayment, setDownPayment] = useState(property.price * 0.2)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [annualIncome, setAnnualIncome] = useState(120000)
  const [monthlyDebts, setMonthlyDebts] = useState(800)
  const [mortgageCalc, setMortgageCalc] = useState<MortgageCalculation | null>(null)
  const [affordabilityAnalysis, setAffordabilityAnalysis] = useState<AffordabilityAnalysis | null>(null)

  // Scenario comparison state - separate base scenarios from calculations
  const [scenarioParams, setScenarioParams] = useState<LoanScenarioBase[]>([
    {
      id: "scenario-1",
      name: "Conservative (20% Down)",
      downPayment: property.price * 0.2,
      interestRate: 6.5,
      loanTerm: 30,
      color: "bg-blue-500",
    },
    {
      id: "scenario-2",
      name: "Aggressive (10% Down)",
      downPayment: property.price * 0.1,
      interestRate: 6.75,
      loanTerm: 30,
      color: "bg-green-500",
    },
    {
      id: "scenario-3",
      name: "15-Year Loan",
      downPayment: property.price * 0.2,
      interestRate: 6.25,
      loanTerm: 15,
      color: "bg-purple-500",
    },
  ])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatPricePerSqFt = (price: number, sqft: number) => {
    const pricePerSqFt = price / sqft
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(pricePerSqFt)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculatePriceChange = (currentPrice: number, previousPrice: number) => {
    const change = ((currentPrice - previousPrice) / previousPrice) * 100
    return {
      percentage: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      amount: Math.abs(currentPrice - previousPrice),
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600 bg-green-50"
    if (confidence >= 70) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      case "positive":
        return "text-green-600 bg-green-50"
      case "negative":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getAffordabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "high":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  // Calculate mortgage payments - memoized to prevent recalculation
  const calculateMortgage = useCallback(
    (loanAmount: number, interestRate: number, loanTerm: number, downPayment: number): MortgageCalculation => {
      const principal = loanAmount
      const monthlyRate = interestRate / 100 / 12
      const numberOfPayments = loanTerm * 12

      // Monthly principal and interest
      const monthlyPI =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

      // Estimate property tax (1.2% annually)
      const propertyTax = (property.price * 0.012) / 12

      // Estimate home insurance (0.5% annually)
      const insurance = (property.price * 0.005) / 12

      // PMI if down payment is less than 20%
      const downPaymentPercent = (downPayment / property.price) * 100
      const pmi = downPaymentPercent < 20 ? (loanAmount * 0.005) / 12 : 0

      const monthlyPayment = monthlyPI + propertyTax + insurance + pmi
      const totalPayment = monthlyPI * numberOfPayments
      const totalInterest = totalPayment - principal

      return {
        monthlyPayment,
        totalInterest,
        totalPayment,
        principalAndInterest: monthlyPI,
        propertyTax,
        insurance,
        pmi,
      }
    },
    [property.price],
  )

  // AI-powered affordability analysis
  const calculateAffordability = useCallback(
    (mortgage: MortgageCalculation): AffordabilityAnalysis => {
      const monthlyIncome = annualIncome / 12
      const housingRatio = (mortgage.monthlyPayment / monthlyIncome) * 100
      const debtToIncomeRatio = ((mortgage.monthlyPayment + monthlyDebts) / monthlyIncome) * 100

      // Calculate affordability score (0-100)
      let affordabilityScore = 100
      if (housingRatio > 28) affordabilityScore -= (housingRatio - 28) * 2
      if (debtToIncomeRatio > 36) affordabilityScore -= (debtToIncomeRatio - 36) * 3
      affordabilityScore = Math.max(0, Math.min(100, affordabilityScore))

      // Recommended income (mortgage payment should be max 28% of income)
      const recommendedIncome = (mortgage.monthlyPayment / 0.28) * 12

      // Risk level assessment
      let riskLevel = "Low"
      if (debtToIncomeRatio > 43 || housingRatio > 31) riskLevel = "High"
      else if (debtToIncomeRatio > 36 || housingRatio > 28) riskLevel = "Medium"

      // Monthly budget breakdown
      const monthlyBudgetBreakdown = {
        housing: mortgage.monthlyPayment,
        otherDebts: monthlyDebts,
        livingExpenses: monthlyIncome * 0.35, // 35% for living expenses
        savings: monthlyIncome * 0.15, // 15% for savings
        discretionary: monthlyIncome - mortgage.monthlyPayment - monthlyDebts - monthlyIncome * 0.5,
      }

      // AI recommendations
      const recommendations = []
      if (housingRatio > 28) {
        recommendations.push("Consider a larger down payment to reduce monthly payments")
        recommendations.push("Look for properties in a lower price range")
      }
      if (debtToIncomeRatio > 36) {
        recommendations.push("Pay down existing debts before purchasing")
        recommendations.push("Consider increasing your income before buying")
      }
      if (affordabilityScore > 80) {
        recommendations.push("You're in excellent financial position for this purchase")
        recommendations.push("Consider setting aside extra funds for home improvements")
      }
      if (downPayment < property.price * 0.2) {
        recommendations.push("Save for a 20% down payment to avoid PMI")
      }

      return {
        recommendedIncome,
        debtToIncomeRatio,
        affordabilityScore,
        recommendations,
        riskLevel,
        monthlyBudgetBreakdown,
      }
    },
    [annualIncome, monthlyDebts, property.price, downPayment],
  )

  // Calculate scenarios with calculations - memoized
  const scenarios = useMemo((): LoanScenario[] => {
    return scenarioParams.map((scenario) => ({
      ...scenario,
      calculation: calculateMortgage(
        property.price - scenario.downPayment,
        scenario.interestRate,
        scenario.loanTerm,
        scenario.downPayment,
      ),
    }))
  }, [scenarioParams, property.price, calculateMortgage])

  // Calculate best scenario based on AI analysis - memoized
  const bestScenario = useMemo((): string => {
    const monthlyIncome = annualIncome / 12
    let bestScore = -1
    let bestScenarioId = scenarios[0].id

    scenarios.forEach((scenario) => {
      let score = 0
      const housingRatio = (scenario.calculation.monthlyPayment / monthlyIncome) * 100
      const totalCost = scenario.calculation.totalPayment + scenario.downPayment

      // Lower monthly payment is better (up to 40 points)
      score += Math.max(0, 40 - housingRatio)

      // Lower total cost is better (up to 30 points)
      const avgTotalCost =
        scenarios.reduce((sum, s) => sum + s.calculation.totalPayment + s.downPayment, 0) / scenarios.length
      const costRatio = (totalCost / avgTotalCost) * 100
      score += Math.max(0, 30 - (costRatio - 100))

      // No PMI is better (up to 20 points)
      if (scenario.calculation.pmi === 0) score += 20

      // Shorter loan term is better (up to 10 points)
      score += Math.max(0, 10 - (scenario.loanTerm - 15) / 3)

      if (score > bestScore) {
        bestScore = score
        bestScenarioId = scenario.id
      }
    })

    return bestScenarioId
  }, [scenarios, annualIncome])

  // Update scenario
  const updateScenario = useCallback((scenarioId: string, field: string, value: number) => {
    setScenarioParams((prev) =>
      prev.map((scenario) =>
        scenario.id === scenarioId
          ? {
              ...scenario,
              [field]: value,
            }
          : scenario,
      ),
    )
  }, [])

  // Add new scenario
  const addScenario = useCallback(() => {
    const newScenario: LoanScenarioBase = {
      id: `scenario-${scenarioParams.length + 1}`,
      name: `Custom Scenario ${scenarioParams.length + 1}`,
      downPayment: property.price * 0.15,
      interestRate: 6.5,
      loanTerm: 30,
      color: `bg-${["red", "yellow", "indigo", "pink", "gray"][scenarioParams.length % 5]}-500`,
    }
    setScenarioParams([...scenarioParams, newScenario])
  }, [scenarioParams, property.price])

  // Remove scenario
  const removeScenario = useCallback(
    (scenarioId: string) => {
      if (scenarioParams.length > 2) {
        setScenarioParams(scenarioParams.filter((s) => s.id !== scenarioId))
      }
    },
    [scenarioParams],
  )

  // Update calculations when inputs change
  useEffect(() => {
    const mortgage = calculateMortgage(loanAmount, interestRate, loanTerm, downPayment)
    const affordability = calculateAffordability(mortgage)
    setMortgageCalc(mortgage)
    setAffordabilityAnalysis(affordability)
  }, [loanAmount, downPayment, interestRate, loanTerm, calculateMortgage, calculateAffordability])

  // Update loan amount when down payment changes
  useEffect(() => {
    setLoanAmount(property.price - downPayment)
  }, [downPayment, property.price])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 truncate">{property.title}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{property.address}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Price and key stats */}
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms} bed</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms} bath</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.squareFeet} sqm</span>
                </div>
              </div>
              {property.marketData?.pricePerSqFt && (
                <div className="text-sm text-gray-600 mt-1">
                  {formatPricePerSqFt(property.price, property.squareFeet)} per sqm
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2 mt-4">
              <Button className="flex-1 bg-[#FFD166] text-black hover:bg-[#FFD166]/90">
                <Phone className="h-4 w-4 mr-2" />
                Contact Agent
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto h-full pb-20">
            {/* Overview Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("overview")}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-[#FFD166] mr-3" />
                    <span className="font-semibold text-gray-900">Property Overview</span>
                  </div>
                  {expandedSections.has("overview") ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedSections.has("overview") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Property Type</div>
                          <div className="font-medium text-gray-900">{property.propertyType || "House"}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Year Built</div>
                          <div className="font-medium text-gray-900">{property.yearBuilt || "2020"}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Lot Size</div>
                          <div className="font-medium text-gray-900">{property.lotSize || "500 sqm"}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Days on Market</div>
                          <div className="font-medium text-gray-900">{property.marketData?.daysOnMarket || "14"}</div>
                        </div>
                      </div>

                      {property.description && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {property.description ||
                              "Beautiful modern home featuring spacious living areas, updated kitchen with premium appliances, and a private backyard perfect for entertaining. Located in a desirable neighborhood with excellent schools and convenient access to shopping and dining."}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mortgage Calculator Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("mortgage")}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-[#FFD166] mr-3" />
                    <span className="font-semibold text-gray-900">Mortgage Calculator</span>
                    <Sparkles className="h-4 w-4 text-[#FFD166] ml-2" />
                  </div>
                  {expandedSections.has("mortgage") ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedSections.has("mortgage") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <Tabs defaultValue="calculator" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                          <TabsTrigger value="calculator" className="text-xs">
                            Calculator
                          </TabsTrigger>
                          <TabsTrigger value="scenarios" className="text-xs">
                            Compare Scenarios
                          </TabsTrigger>
                          <TabsTrigger value="affordability" className="text-xs">
                            AI Affordability
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="calculator" className="mt-0">
                          <div className="space-y-4">
                            {/* Loan Inputs */}
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Home Price</label>
                                <div className="text-lg font-bold text-gray-900">{formatPrice(property.price)}</div>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Down Payment: {formatPrice(downPayment)} (
                                  {((downPayment / property.price) * 100).toFixed(1)}%)
                                </label>
                                <Slider
                                  value={[downPayment]}
                                  onValueChange={(value) => setDownPayment(value[0])}
                                  max={property.price * 0.5}
                                  min={property.price * 0.05}
                                  step={1000}
                                  className="w-full"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Interest Rate: {interestRate}%
                                </label>
                                <Slider
                                  value={[interestRate]}
                                  onValueChange={(value) => setInterestRate(value[0])}
                                  max={10}
                                  min={3}
                                  step={0.1}
                                  className="w-full"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Loan Term: {loanTerm} years
                                </label>
                                <Slider
                                  value={[loanTerm]}
                                  onValueChange={(value) => setLoanTerm(value[0])}
                                  max={30}
                                  min={15}
                                  step={5}
                                  className="w-full"
                                />
                              </div>
                            </div>

                            {/* Monthly Payment Breakdown */}
                            {mortgageCalc && (
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Monthly Payment Breakdown
                                </h4>

                                <div className="space-y-3">
                                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-sm text-gray-600">Principal & Interest</span>
                                    <span className="font-bold text-gray-900">
                                      {formatPrice(mortgageCalc.principalAndInterest)}
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-sm text-gray-600">Property Tax</span>
                                    <span className="font-bold text-gray-900">
                                      {formatPrice(mortgageCalc.propertyTax)}
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-sm text-gray-600">Home Insurance</span>
                                    <span className="font-bold text-gray-900">
                                      {formatPrice(mortgageCalc.insurance)}
                                    </span>
                                  </div>

                                  {mortgageCalc.pmi > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                      <span className="text-sm text-gray-600">PMI</span>
                                      <span className="font-bold text-gray-900">{formatPrice(mortgageCalc.pmi)}</span>
                                    </div>
                                  )}

                                  <div className="flex justify-between items-center p-3 bg-[#FFD166] rounded-lg">
                                    <span className="font-semibold text-black">Total Monthly Payment</span>
                                    <span className="font-bold text-xl text-black">
                                      {formatPrice(mortgageCalc.monthlyPayment)}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                      <div className="text-sm text-gray-600">Total Interest</div>
                                      <div className="font-bold text-gray-900">
                                        {formatPrice(mortgageCalc.totalInterest)}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-600">Total Payment</div>
                                      <div className="font-bold text-gray-900">
                                        {formatPrice(mortgageCalc.totalPayment)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="scenarios" className="mt-0">
                          <div className="space-y-4">
                            {/* Header with Add Scenario Button */}
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <Compare className="h-4 w-4 mr-2" />
                                Loan Scenarios
                              </h4>
                              <Button
                                onClick={addScenario}
                                size="sm"
                                variant="outline"
                                className="text-xs bg-transparent"
                                disabled={scenarioParams.length >= 5}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Scenario
                              </Button>
                            </div>

                            {/* AI Best Scenario Recommendation */}
                            {bestScenario && (
                              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-4">
                                <div className="flex items-center mb-2">
                                  <Award className="h-4 w-4 text-green-600 mr-2" />
                                  <span className="font-medium text-green-900">AI Recommended</span>
                                </div>
                                <p className="text-sm text-green-700">
                                  <strong>
                                    {scenarios.find((s) => s.id === bestScenario)?.name || "Best Scenario"}
                                  </strong>{" "}
                                  offers the optimal balance of monthly affordability and total cost based on your
                                  financial profile.
                                </p>
                              </div>
                            )}

                            {/* Scenario Configuration */}
                            <div className="space-y-4">
                              {scenarios.map((scenario, index) => (
                                <div
                                  key={scenario.id}
                                  className={`border rounded-lg p-4 ${
                                    bestScenario === scenario.id ? "border-green-500 bg-green-50" : "border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                      <div className={`w-3 h-3 rounded-full ${scenario.color} mr-2`}></div>
                                      <span className="font-medium text-sm text-gray-900">{scenario.name}</span>
                                      {bestScenario === scenario.id && (
                                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Best</Badge>
                                      )}
                                    </div>
                                    {scenarioParams.length > 2 && (
                                      <Button
                                        onClick={() => removeScenario(scenario.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div>
                                      <label className="text-xs text-gray-500 block mb-1">Down Payment</label>
                                      <div className="text-xs font-medium text-gray-900">
                                        {formatPrice(scenario.downPayment)}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {((scenario.downPayment / property.price) * 100).toFixed(0)}%
                                      </div>
                                      <Slider
                                        value={[scenario.downPayment]}
                                        onValueChange={(value) => updateScenario(scenario.id, "downPayment", value[0])}
                                        max={property.price * 0.5}
                                        min={property.price * 0.05}
                                        step={5000}
                                        className="mt-1"
                                      />
                                    </div>

                                    <div>
                                      <label className="text-xs text-gray-500 block mb-1">Interest Rate</label>
                                      <div className="text-xs font-medium text-gray-900">{scenario.interestRate}%</div>
                                      <Slider
                                        value={[scenario.interestRate]}
                                        onValueChange={(value) => updateScenario(scenario.id, "interestRate", value[0])}
                                        max={10}
                                        min={3}
                                        step={0.25}
                                        className="mt-2"
                                      />
                                    </div>

                                    <div>
                                      <label className="text-xs text-gray-500 block mb-1">Loan Term</label>
                                      <div className="text-xs font-medium text-gray-900">{scenario.loanTerm} years</div>
                                      <Slider
                                        value={[scenario.loanTerm]}
                                        onValueChange={(value) => updateScenario(scenario.id, "loanTerm", value[0])}
                                        max={30}
                                        min={15}
                                        step={5}
                                        className="mt-2"
                                      />
                                    </div>
                                  </div>

                                  {/* Scenario Results */}
                                  {scenario.calculation.monthlyPayment && (
                                    <div className="bg-white rounded-lg p-3 border">
                                      <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                          <span className="text-gray-500">Monthly Payment</span>
                                          <div className="font-bold text-gray-900">
                                            {formatPrice(scenario.calculation.monthlyPayment)}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Total Interest</span>
                                          <div className="font-bold text-gray-900">
                                            {formatPrice(scenario.calculation.totalInterest)}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Total Cost</span>
                                          <div className="font-bold text-gray-900">
                                            {formatPrice(scenario.calculation.totalPayment + scenario.downPayment)}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">PMI</span>
                                          <div className="font-bold text-gray-900">
                                            {scenario.calculation.pmi > 0
                                              ? formatPrice(scenario.calculation.pmi)
                                              : "None"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Scenario Comparison Table */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-3">Side-by-Side Comparison</h5>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left py-2 text-gray-600">Scenario</th>
                                      <th className="text-right py-2 text-gray-600">Monthly</th>
                                      <th className="text-right py-2 text-gray-600">Total Cost</th>
                                      <th className="text-right py-2 text-gray-600">Interest Saved</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {scenarios.map((scenario, index) => {
                                      const baseScenario = scenarios[0]
                                      const interestSaved =
                                        baseScenario.calculation.totalInterest - scenario.calculation.totalInterest
                                      return (
                                        <tr key={scenario.id} className="border-b border-gray-100">
                                          <td className="py-2">
                                            <div className="flex items-center">
                                              <div className={`w-2 h-2 rounded-full ${scenario.color} mr-2`}></div>
                                              <span className="font-medium">{scenario.name}</span>
                                              {bestScenario === scenario.id && (
                                                <Badge className="ml-1 bg-green-100 text-green-800 text-xs">Best</Badge>
                                              )}
                                            </div>
                                          </td>
                                          <td className="text-right py-2 font-medium">
                                            {formatPrice(scenario.calculation.monthlyPayment)}
                                          </td>
                                          <td className="text-right py-2 font-medium">
                                            {formatPrice(scenario.calculation.totalPayment + scenario.downPayment)}
                                          </td>
                                          <td className="text-right py-2">
                                            {index === 0 ? (
                                              <span className="text-gray-500">Base</span>
                                            ) : (
                                              <span className={interestSaved > 0 ? "text-green-600" : "text-red-600"}>
                                                {interestSaved > 0 ? "+" : ""}
                                                {formatPrice(Math.abs(interestSaved))}
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* AI Scenario Analysis */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                              <h5 className="font-medium text-purple-900 mb-3 flex items-center">
                                <Brain className="h-4 w-4 mr-2" />
                                AI Scenario Analysis
                              </h5>
                              <div className="space-y-2 text-sm">
                                {scenarios.map((scenario) => {
                                  const monthlyIncome = annualIncome / 12
                                  const housingRatio = (scenario.calculation.monthlyPayment / monthlyIncome) * 100
                                  let analysis = ""

                                  if (scenario.id === bestScenario) {
                                    analysis = "✅ Optimal balance of affordability and total cost"
                                  } else if (housingRatio > 28) {
                                    analysis = "⚠️ Monthly payment may strain your budget"
                                  } else if (scenario.calculation.pmi > 0) {
                                    analysis = "💡 Consider saving more for down payment to avoid PMI"
                                  } else if (scenario.loanTerm === 15) {
                                    analysis = "🚀 Builds equity faster but higher monthly payments"
                                  } else {
                                    analysis = "👍 Good option with manageable payments"
                                  }

                                  return (
                                    <div key={scenario.id} className="flex items-start">
                                      <div className={`w-2 h-2 rounded-full ${scenario.color} mr-2 mt-2`}></div>
                                      <div>
                                        <span className="font-medium text-purple-900">{scenario.name}:</span>
                                        <span className="text-purple-700 ml-1">{analysis}</span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="affordability" className="mt-0">
                          <div className="space-y-4">
                            {/* Income and Debt Inputs */}
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Annual Income</label>
                                <Input
                                  type="number"
                                  value={annualIncome}
                                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                                  placeholder="120000"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Monthly Debts (car, credit cards, etc.)
                                </label>
                                <Input
                                  type="number"
                                  value={monthlyDebts}
                                  onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                                  placeholder="800"
                                />
                              </div>
                            </div>

                            {/* AI Affordability Analysis */}
                            {affordabilityAnalysis && mortgageCalc && (
                              <div className="space-y-4">
                                {/* Affordability Score */}
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900 flex items-center">
                                      <Brain className="h-4 w-4 mr-2 text-purple-600" />
                                      AI Affordability Score
                                    </h4>
                                    <div
                                      className={`px-3 py-1 rounded-full text-sm font-bold ${getAffordabilityColor(affordabilityAnalysis.affordabilityScore)}`}
                                    >
                                      {affordabilityAnalysis.affordabilityScore.toFixed(0)}/100
                                    </div>
                                  </div>
                                  <Progress value={affordabilityAnalysis.affordabilityScore} className="mb-2" />
                                  <p className="text-xs text-gray-600">
                                    Based on your income, debts, and this property's cost
                                  </p>
                                </div>

                                {/* Key Ratios */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Housing Ratio</div>
                                    <div className="font-bold text-lg text-gray-900">
                                      {((mortgageCalc.monthlyPayment / (annualIncome / 12)) * 100).toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-gray-600">Recommended: ≤28%</div>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Debt-to-Income</div>
                                    <div className="font-bold text-lg text-gray-900">
                                      {affordabilityAnalysis.debtToIncomeRatio.toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-gray-600">Recommended: ≤36%</div>
                                  </div>
                                </div>

                                {/* Risk Assessment */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Risk Level</span>
                                    <Badge className={`${getRiskLevelColor(affordabilityAnalysis.riskLevel)}`}>
                                      {affordabilityAnalysis.riskLevel}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {affordabilityAnalysis.riskLevel === "Low" &&
                                      "You're in excellent financial position for this purchase."}
                                    {affordabilityAnalysis.riskLevel === "Medium" &&
                                      "This purchase is manageable but requires careful budgeting."}
                                    {affordabilityAnalysis.riskLevel === "High" &&
                                      "This purchase may strain your finances. Consider alternatives."}
                                  </div>
                                </div>

                                {/* Monthly Budget Breakdown */}
                                <div className="bg-white border rounded-lg p-4">
                                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <PiggyBank className="h-4 w-4 mr-2" />
                                    Monthly Budget Breakdown
                                  </h5>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Housing (PITI)</span>
                                      <span className="font-medium">
                                        {formatPrice(affordabilityAnalysis.monthlyBudgetBreakdown.housing)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Other Debts</span>
                                      <span className="font-medium">
                                        {formatPrice(affordabilityAnalysis.monthlyBudgetBreakdown.otherDebts)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Living Expenses</span>
                                      <span className="font-medium">
                                        {formatPrice(affordabilityAnalysis.monthlyBudgetBreakdown.livingExpenses)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Savings</span>
                                      <span className="font-medium">
                                        {formatPrice(affordabilityAnalysis.monthlyBudgetBreakdown.savings)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm border-t pt-2">
                                      <span className="text-gray-600">Discretionary</span>
                                      <span
                                        className={`font-medium ${affordabilityAnalysis.monthlyBudgetBreakdown.discretionary > 0 ? "text-green-600" : "text-red-600"}`}
                                      >
                                        {formatPrice(affordabilityAnalysis.monthlyBudgetBreakdown.discretionary)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* AI Recommendations */}
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                                    AI Recommendations
                                  </h5>
                                  <div className="space-y-2">
                                    {affordabilityAnalysis.recommendations.map((rec, index) => (
                                      <div key={index} className="flex items-start text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{rec}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Recommended Income */}
                                {affordabilityAnalysis.recommendedIncome > annualIncome && (
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                                      <span className="font-medium text-blue-900">Income Recommendation</span>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                      For comfortable affordability, consider an annual income of{" "}
                                      <span className="font-bold">
                                        {formatPrice(affordabilityAnalysis.recommendedIncome)}
                                      </span>{" "}
                                      or higher.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Price Predictions Section */}
            {property.marketData?.aiPredictions && (
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("ai-predictions")}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-[#FFD166] mr-3" />
                      <span className="font-semibold text-gray-900">AI Price Predictions</span>
                      <Sparkles className="h-4 w-4 text-[#FFD166] ml-2" />
                    </div>
                    {expandedSections.has("ai-predictions") ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedSections.has("ai-predictions") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        {/* AI Model Info */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 flex items-center">
                              <Target className="h-4 w-4 mr-2 text-purple-600" />
                              AI Model Confidence
                            </h4>
                            <div
                              className={`px-2 py-1 rounded text-xs font-bold ${getConfidenceColor(property.marketData.aiPredictions.confidenceScore)}`}
                            >
                              {property.marketData.aiPredictions.confidenceScore}%
                            </div>
                          </div>
                          <Progress value={property.marketData.aiPredictions.confidenceScore} className="mb-2" />
                          <p className="text-xs text-gray-600">{property.marketData.aiPredictions.methodology}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Last updated: {formatDate(property.marketData.aiPredictions.lastUpdated)}
                          </p>
                        </div>

                        <Tabs defaultValue="predictions" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="predictions" className="text-xs">
                              Forecasts
                            </TabsTrigger>
                            <TabsTrigger value="risks" className="text-xs">
                              Risk Factors
                            </TabsTrigger>
                            <TabsTrigger value="drivers" className="text-xs">
                              Market Drivers
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="predictions" className="mt-0">
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900 flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Price Forecasts
                              </h4>

                              {Object.entries(
                                property.marketData.aiPredictions.predictions || {
                                  "3months": {
                                    price: property.price * 1.02,
                                    change: 2.1,
                                    confidence: 88,
                                    factors: ["Strong local demand", "Low inventory"],
                                  },
                                  "6months": {
                                    price: property.price * 1.04,
                                    change: 4.3,
                                    confidence: 82,
                                    factors: ["Infrastructure development", "Population growth"],
                                  },
                                  "12months": {
                                    price: property.price * 1.07,
                                    change: 7.2,
                                    confidence: 75,
                                    factors: ["Economic growth", "Interest rate stability"],
                                  },
                                  "24months": {
                                    price: property.price * 1.12,
                                    change: 12.1,
                                    confidence: 68,
                                    factors: ["Long-term appreciation", "Market fundamentals"],
                                  },
                                },
                              ).map(([period, prediction]) => (
                                <div key={period} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-900 capitalize">
                                      {period.replace(/(\d+)/, "$1 ")}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-bold text-gray-900">
                                        {formatPrice(prediction.price)}
                                      </span>
                                      <div
                                        className={`flex items-center text-xs ${
                                          prediction.change > 0 ? "text-green-600" : "text-red-600"
                                        }`}
                                      >
                                        {prediction.change > 0 ? (
                                          <TrendingUp className="h-3 w-3 mr-1" />
                                        ) : (
                                          <TrendingDown className="h-3 w-3 mr-1" />
                                        )}
                                        {prediction.change > 0 ? "+" : ""}
                                        {prediction.change.toFixed(1)}%
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500">Confidence</span>
                                    <div
                                      className={`px-2 py-1 rounded text-xs font-bold ${getConfidenceColor(prediction.confidence)}`}
                                    >
                                      {prediction.confidence}%
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-xs text-gray-500">Key Factors:</span>
                                    {prediction.factors.map((factor, index) => (
                                      <div key={index} className="flex items-center text-xs text-gray-600">
                                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                        {factor}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-medium text-blue-900 mb-2">Investment Outlook</h5>
                                <p className="text-sm text-blue-700">
                                  Based on our AI analysis, this property shows strong growth potential with a 7.2%
                                  predicted increase over the next 12 months.
                                </p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="risks" className="mt-0">
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Risk Assessment
                              </h4>

                              {(
                                property.marketData.aiPredictions.riskFactors || [
                                  { factor: "Interest Rate Changes", impact: "Medium", probability: "Medium" },
                                  { factor: "Economic Downturn", impact: "High", probability: "Low" },
                                  { factor: "Local Policy Changes", impact: "Low", probability: "Medium" },
                                ]
                              ).map((risk, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-900">{risk.factor}</span>
                                    <div className="flex space-x-2">
                                      <Badge className={`text-xs ${getImpactColor(risk.impact)}`}>
                                        {risk.impact} Impact
                                      </Badge>
                                      <Badge className={`text-xs ${getImpactColor(risk.probability)}`}>
                                        {risk.probability} Probability
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                                <h5 className="font-medium text-yellow-900 mb-2">Risk Summary</h5>
                                <p className="text-sm text-yellow-700">
                                  Overall risk level is considered moderate. Key risks include interest rate changes and
                                  potential policy shifts, but strong fundamentals support price stability.
                                </p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="drivers" className="mt-0">
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900 flex items-center">
                                <Activity className="h-4 w-4 mr-2" />
                                Market Drivers
                              </h4>

                              {(
                                property.marketData.aiPredictions.marketDrivers || [
                                  { driver: "Population Growth", impact: "Positive", strength: "Strong" },
                                  { driver: "Infrastructure Development", impact: "Positive", strength: "Medium" },
                                  { driver: "Employment Growth", impact: "Positive", strength: "Strong" },
                                ]
                              ).map((driver, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm text-gray-900">{driver.driver}</span>
                                    <div className="flex space-x-2">
                                      <Badge className={`text-xs ${getImpactColor(driver.impact)}`}>
                                        {driver.impact}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {driver.strength}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-green-900 mb-2">Growth Drivers</h5>
                                <p className="text-sm text-green-700">
                                  Strong positive drivers including population growth and infrastructure development are
                                  expected to support continued price appreciation in this area.
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Price History & Market Data Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("market")}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-[#FFD166] mr-3" />
                    <span className="font-semibold text-gray-900">Price History & Market Data</span>
                  </div>
                  {expandedSections.has("market") ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedSections.has("market") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <Tabs defaultValue="history" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                          <TabsTrigger value="history" className="text-xs">
                            Price History
                          </TabsTrigger>
                          <TabsTrigger value="comparables" className="text-xs">
                            Comparables
                          </TabsTrigger>
                          <TabsTrigger value="trends" className="text-xs">
                            Market Trends
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="history" className="mt-0">
                          {(property.marketData?.priceHistory || [
                            { date: "2024-01-15", price: property.price, event: "Current Listing", change: 0 },
                            { date: "2023-06-20", price: property.price * 0.95, event: "Previous Sale", change: 5.3 },
                            { date: "2021-03-10", price: property.price * 0.85, event: "Purchase", change: 11.8 },
                          ]) && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900 flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Price History
                              </h4>

                              <div className="space-y-2">
                                {(
                                  property.marketData?.priceHistory || [
                                    { date: "2024-01-15", price: property.price, event: "Current Listing", change: 0 },
                                    {
                                      date: "2023-06-20",
                                      price: property.price * 0.95,
                                      event: "Previous Sale",
                                      change: 5.3,
                                    },
                                    {
                                      date: "2021-03-10",
                                      price: property.price * 0.85,
                                      event: "Purchase",
                                      change: 11.8,
                                    },
                                  ]
                                ).map((entry, index) => {
                                  const previousEntry = (property.marketData?.priceHistory || [
                                    { date: "2024-01-15", price: property.price, event: "Current Listing", change: 0 },
                                    {
                                      date: "2023-06-20",
                                      price: property.price * 0.95,
                                      event: "Previous Sale",
                                      change: 5.3,
                                    },
                                    {
                                      date: "2021-03-10",
                                      price: property.price * 0.85,
                                      event: "Purchase",
                                      change: 11.8,
                                    },
                                  ])[index + 1]
                                  const priceChange = previousEntry
                                    ? calculatePriceChange(entry.price, previousEntry.price)
                                    : null

                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium text-sm text-gray-900">{entry.event}</span>
                                          <span className="text-sm font-bold text-gray-900">
                                            {formatPrice(entry.price)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                          <span className="text-xs text-gray-500">{formatDate(entry.date)}</span>
                                          {priceChange && (
                                            <div
                                              className={`flex items-center text-xs ${
                                                priceChange.isPositive ? "text-green-600" : "text-red-600"
                                              }`}
                                            >
                                              {priceChange.isPositive ? (
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                              ) : (
                                                <TrendingDown className="h-3 w-3 mr-1" />
                                              )}
                                              {priceChange.isPositive ? "+" : "-"}
                                              {priceChange.percentage}%
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Price Appreciation Summary */}
                              {(property.marketData?.marketTrends || {
                                priceAppreciation: { "1year": 8.5, "3year": 24.2, "5year": 45.8 },
                              }) && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                  <h5 className="font-medium text-blue-900 mb-2">Price Appreciation</h5>
                                  <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                      <div className="text-lg font-bold text-blue-700">
                                        +{property.marketData?.marketTrends?.priceAppreciation?.["1year"] || 8.5}%
                                      </div>
                                      <div className="text-xs text-blue-600">1 Year</div>
                                    </div>
                                    <div>
                                      <div className="text-lg font-bold text-blue-700">
                                        +{property.marketData?.marketTrends?.priceAppreciation?.["3year"] || 24.2}%
                                      </div>
                                      <div className="text-xs text-blue-600">3 Years</div>
                                    </div>
                                    <div>
                                      <div className="text-lg font-bold text-blue-700">
                                        +{property.marketData?.marketTrends?.priceAppreciation?.["5year"] || 45.8}%
                                      </div>
                                      <div className="text-xs text-blue-600">5 Years</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="comparables" className="mt-0">
                          {(property.marketData?.comparableProperties || [
                            {
                              address: "123 Similar St",
                              price: property.price * 0.98,
                              sqft: property.squareFeet * 0.95,
                              soldDate: "2024-01-10",
                            },
                            {
                              address: "456 Nearby Ave",
                              price: property.price * 1.05,
                              sqft: property.squareFeet * 1.1,
                              soldDate: "2023-12-15",
                            },
                            {
                              address: "789 Close Rd",
                              price: property.price * 0.92,
                              sqft: property.squareFeet * 0.88,
                              soldDate: "2023-11-20",
                            },
                          ]) && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900 flex items-center">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Recent Comparable Sales
                              </h4>

                              <div className="space-y-2">
                                {(
                                  property.marketData?.comparableProperties || [
                                    {
                                      address: "123 Similar St",
                                      price: property.price * 0.98,
                                      sqft: property.squareFeet * 0.95,
                                      soldDate: "2024-01-10",
                                    },
                                    {
                                      address: "456 Nearby Ave",
                                      price: property.price * 1.05,
                                      sqft: property.squareFeet * 1.1,
                                      soldDate: "2023-12-15",
                                    },
                                    {
                                      address: "789 Close Rd",
                                      price: property.price * 0.92,
                                      sqft: property.squareFeet * 0.88,
                                      soldDate: "2023-11-20",
                                    },
                                  ]
                                ).map((comp, index) => (
                                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm text-gray-900 truncate">{comp.address}</span>
                                      <span className="text-sm font-bold text-gray-900">{formatPrice(comp.price)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                      <span>{comp.sqft} sqm</span>
                                      <span>{formatPricePerSqFt(comp.price, comp.sqft)} per sqm</span>
                                      <span>Sold {formatDate(comp.soldDate)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-green-700">Average Price/sqm</span>
                                  <span className="font-bold text-green-800">
                                    {formatPricePerSqFt(property.price, property.squareFeet)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="trends" className="mt-0">
                          {(property.marketData?.marketTrends || {
                            averagePriceChange: 8.5,
                            medianDaysOnMarket: 18,
                            inventoryLevel: "Low",
                          }) && (
                            <div className="space-y-4">
                              <h4 className="font-medium text-gray-900 flex items-center">
                                <Activity className="h-4 w-4 mr-2" />
                                Market Trends
                              </h4>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-blue-50 rounded-lg text-center">
                                  <div className="text-lg font-bold text-blue-700">
                                    {(property.marketData?.marketTrends?.averagePriceChange || 8.5) > 0 ? "+" : ""}
                                    {property.marketData?.marketTrends?.averagePriceChange || 8.5}%
                                  </div>
                                  <div className="text-xs text-blue-600">Avg Price Change</div>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg text-center">
                                  <div className="text-lg font-bold text-orange-700">
                                    {property.marketData?.marketTrends?.medianDaysOnMarket || 18}
                                  </div>
                                  <div className="text-xs text-orange-600">Median Days on Market</div>
                                </div>
                              </div>

                              <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-purple-700">Inventory Level</span>
                                  <Badge
                                    variant={
                                      (property.marketData?.marketTrends?.inventoryLevel || "Low") === "Low"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {property.marketData?.marketTrends?.inventoryLevel || "Low"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-purple-600 mt-1">
                                  {(property.marketData?.marketTrends?.inventoryLevel || "Low") === "Low"
                                    ? "Seller's market - Limited inventory may drive prices up"
                                    : "Balanced market conditions"}
                                </p>
                              </div>

                              <div className="p-3 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-2">Market Summary</h5>
                                <p className="text-sm text-gray-600">
                                  This property is in a{" "}
                                  {(property.marketData?.marketTrends?.inventoryLevel || "low").toLowerCase()} inventory
                                  market with{" "}
                                  {(property.marketData?.marketTrends?.averagePriceChange || 8.5) > 0
                                    ? "rising"
                                    : "declining"}{" "}
                                  prices. Properties typically sell within{" "}
                                  {property.marketData?.marketTrends?.medianDaysOnMarket || 18} days.
                                </p>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("features")}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-[#FFD166] mr-3" />
                    <span className="font-semibold text-gray-900">Features & Amenities</span>
                  </div>
                  {expandedSections.has("features") ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedSections.has("features") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 gap-3">
                        {/* Standard features */}
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <Wifi className="h-4 w-4 text-green-600 mr-3" />
                          <span className="text-sm text-gray-900">High-speed Internet Ready</span>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <Car className="h-4 w-4 text-blue-600 mr-3" />
                          <span className="text-sm text-gray-900">{property.systems?.parking || "2-car garage"}</span>
                        </div>
                        <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                          <Thermometer className="h-4 w-4 text-orange-600 mr-3" />
                          <span className="text-sm text-gray-900">
                            {property.systems?.heating || "Central heating"}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-cyan-50 rounded-lg">
                          <Thermometer className="h-4 w-4 text-cyan-600 mr-3" />
                          <span className="text-sm text-gray-900">
                            {property.systems?.cooling || "Air conditioning"}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                          <Shield className="h-4 w-4 text-purple-600 mr-3" />
                          <span className="text-sm text-gray-900">Security System</span>
                        </div>
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <Trees className="h-4 w-4 text-green-600 mr-3" />
                          <span className="text-sm text-gray-900">Landscaped Garden</span>
                        </div>
                      </div>

                      {property.features && property.features.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-3">Additional Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {property.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Neighborhood Section */}
            {property.neighborhood && (
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("neighborhood")}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-[#FFD166] mr-3" />
                      <span className="font-semibold text-gray-900">Neighborhood</span>
                    </div>
                    {expandedSections.has("neighborhood") ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedSections.has("neighborhood") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {property.neighborhood.name || "Riverside Heights"}
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold text-[#FFD166]">
                                {property.neighborhood.walkScore || 85}
                              </div>
                              <div className="text-xs text-gray-600">Walk Score</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold text-[#FFD166]">
                                {property.neighborhood.transitScore || 78}
                              </div>
                              <div className="text-xs text-gray-600">Transit</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold text-[#FFD166]">
                                {property.neighborhood.bikeScore || 72}
                              </div>
                              <div className="text-xs text-gray-600">Bike Score</div>
                            </div>
                          </div>
                        </div>

                        {(
                          property.schools || [
                            { name: "Riverside Elementary", rating: 9, distance: "0.3 km" },
                            { name: "Central High School", rating: 8, distance: "1.2 km" },
                            { name: "St. Mary's College", rating: 9, distance: "2.1 km" },
                          ]
                        ).length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Nearby Schools</h4>
                            <div className="space-y-2">
                              {(
                                property.schools || [
                                  { name: "Riverside Elementary", rating: 9, distance: "0.3 km" },
                                  { name: "Central High School", rating: 8, distance: "1.2 km" },
                                  { name: "St. Mary's College", rating: 9, distance: "2.1 km" },
                                ]
                              ).map((school, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <div className="font-medium text-sm text-gray-900">{school.name}</div>
                                    <div className="text-xs text-gray-600">{school.distance}</div>
                                  </div>
                                  <div className="bg-[#FFD166] text-black text-xs font-bold px-2 py-1 rounded">
                                    {school.rating}/10
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Contact Section */}
            <div className="p-4">
              <div className="bg-gradient-to-r from-[#FFD166]/10 to-[#FFD166]/5 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Interested in this property?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Get in touch with our expert agents for more information or to schedule a viewing.
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-[#FFD166] text-black hover:bg-[#FFD166]/90">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
