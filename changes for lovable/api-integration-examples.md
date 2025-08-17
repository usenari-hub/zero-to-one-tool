# API Integration Examples - Before vs After

## 🎯 What "Integration" Means

Integration means replacing static/mock data in your components with real API calls that fetch live data from your database. Here are concrete examples:

---

## Example 1: EnhancedCourseCard Component

### ❌ BEFORE (Static Data)
```typescript
// Your current component probably looks like this:
export const EnhancedCourseCard = ({ course, onShareClick }) => {
  // Static mock data
  const anonymousProfile = {
    anonymousName: "Professor Anonymous",
    verificationLevel: "junior",
    stats: {
      rating: 4.5,
      responseRate: 92
    }
  }

  const handleShareClick = () => {
    // Just opens modal with no real functionality
    onShareClick(course.id)
  }

  return (
    <Card>
      <CardContent>
        <div>{anonymousProfile.anonymousName}</div>
        <div>Rating: {anonymousProfile.stats.rating}</div>
        <Button onClick={handleShareClick}>Share</Button>
      </CardContent>
    </Card>
  )
}
```

### ✅ AFTER (Integrated with APIs)
```typescript
import { useState, useEffect } from 'react'
import { anonymousSellerService } from '@/services/anonymousSellerService'
import { viralSharingService } from '@/services/viralSharingService'

export const EnhancedCourseCard = ({ course, onShareClick }) => {
  // State for real data
  const [anonymousProfile, setAnonymousProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLoading, setShareLoading] = useState(false)

  // REAL API CALL: Fetch anonymous seller data when component loads
  useEffect(() => {
    const loadAnonymousProfile = async () => {
      try {
        const profile = await anonymousSellerService.getAnonymousProfile(course.id)
        setAnonymousProfile(profile)
      } catch (error) {
        console.error('Error loading anonymous profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnonymousProfile()
  }, [course.id])

  // REAL API CALL: Create actual share link when clicked
  const handleShareClick = async () => {
    setShareLoading(true)
    try {
      const shareLink = await viralSharingService.createShareLink(
        course.id,
        'facebook',
        'Check out this amazing course!'
      )
      
      // Pass real share link to parent component
      onShareClick(course.id, shareLink)
    } catch (error) {
      console.error('Error creating share link:', error)
      // Show error toast
    } finally {
      setShareLoading(false)
    }
  }

  if (loading) {
    return <div>Loading course details...</div>
  }

  return (
    <Card>
      <CardContent>
        {/* REAL data from database */}
        <div>{anonymousProfile?.anonymous_name || 'Professor Anonymous'}</div>
        <div>Rating: {anonymousProfile?.display_stats?.rating || 'N/A'}</div>
        <div>Response Rate: {anonymousProfile?.display_stats?.response_rate}%</div>
        
        <Button 
          onClick={handleShareClick} 
          disabled={shareLoading}
        >
          {shareLoading ? 'Creating Link...' : '🎓 I Want to Share This!'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## Example 2: BaconBank Component

### ❌ BEFORE (Static Data)
```typescript
export const BaconBank = () => {
  // Hard-coded fake data
  const baconBalance = 1247.50
  const transactions = [
    { id: 1, amount: 125.00, description: 'MacBook Referral' },
    { id: 2, amount: -500.00, description: 'Withdrawal' }
  ]

  const handleWithdraw = (amount) => {
    // Does nothing real
    alert(`Would withdraw $${amount}`)
  }

  return (
    <div>
      <h2>Balance: ${baconBalance}</h2>
      {transactions.map(t => (
        <div key={t.id}>{t.description}: ${t.amount}</div>
      ))}
      <Button onClick={() => handleWithdraw(100)}>Withdraw</Button>
    </div>
  )
}
```

### ✅ AFTER (Integrated with APIs)
```typescript
import { useState, useEffect } from 'react'
import { baconBankService } from '@/services/baconBankService'
import { useToast } from '@/hooks/use-toast'

export const BaconBank = () => {
  // State for real data
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState(false)
  const { toast } = useToast()

  // REAL API CALL: Load user's actual balance and transactions
  useEffect(() => {
    const loadBankData = async () => {
      try {
        const [balanceData, transactionData] = await Promise.all([
          baconBankService.getBalance(),
          baconBankService.getTransactions()
        ])
        
        setBalance(balanceData)
        setTransactions(transactionData)
      } catch (error) {
        console.error('Error loading bank data:', error)
        toast({
          title: "Error",
          description: "Failed to load bank data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadBankData()
  }, [])

  // REAL API CALL: Process actual withdrawal
  const handleWithdraw = async (amount, paymentMethodId) => {
    setWithdrawing(true)
    try {
      const result = await baconBankService.withdraw(amount, paymentMethodId)
      
      // Update UI with real result
      toast({
        title: "Withdrawal Successful",
        description: `$${amount} withdrawal is being processed`
      })
      
      // Reload balance after withdrawal
      const newBalance = await baconBankService.getBalance()
      setBalance(newBalance)
      
    } catch (error) {
      console.error('Withdrawal error:', error)
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return <div>Loading your Bacon Bank...</div>
  }

  return (
    <div>
      {/* REAL balance from database */}
      <h2>Balance: ${balance?.availableBalance?.toFixed(2) || '0.00'}</h2>
      <p>Pending: ${balance?.pendingEarnings?.toFixed(2) || '0.00'}</p>
      
      {/* REAL transactions from database */}
      {transactions.map(transaction => (
        <div key={transaction.id}>
          {transaction.description}: ${transaction.amount}
          <span className="text-sm text-gray-500">
            {new Date(transaction.created_at).toLocaleDateString()}
          </span>
        </div>
      ))}
      
      <Button 
        onClick={() => handleWithdraw(100, 'bank_account_1')}
        disabled={withdrawing || !balance?.availableBalance || balance.availableBalance < 100}
      >
        {withdrawing ? 'Processing...' : 'Withdraw $100'}
      </Button>
    </div>
  )
}
```

---

## Example 3: StudentDashboard Component

### ❌ BEFORE (Static Data)
```typescript
export const StudentDashboard = () => {
  // Fake static data
  const userStats = {
    currentGPA: 3.2,
    totalBaconEarned: 1250,
    degreeLevel: 'Junior'
  }

  return (
    <div>
      <h1>Student Dashboard</h1>
      <div>GPA: {userStats.currentGPA}</div>
      <div>Bacon Earned: ${userStats.totalBaconEarned}</div>
      <div>Level: {userStats.degreeLevel}</div>
    </div>
  )
}
```

### ✅ AFTER (Integrated with APIs)
```typescript
import { useState, useEffect } from 'react'
import { academicService } from '@/services/academicService'
import { baconBankService } from '@/services/baconBankService'

export const StudentDashboard = () => {
  // State for real data
  const [dashboardData, setDashboardData] = useState(null)
  const [baconData, setBaconData] = useState(null)
  const [loading, setLoading] = useState(true)

  // REAL API CALLS: Load actual user data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [academic, bacon] = await Promise.all([
          academicService.getDashboard(),
          baconBankService.getBalance()
        ])
        
        setDashboardData(academic)
        setBaconData(bacon)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return <div>Loading your academic progress...</div>
  }

  return (
    <div>
      <h1>Student Dashboard</h1>
      
      {/* REAL academic data from database */}
      <div>GPA: {dashboardData?.progression?.overall_gpa?.toFixed(2) || 'N/A'}</div>
      <div>Bacon Earned: ${baconData?.availableBalance?.toFixed(2) || '0.00'}</div>
      <div>Level: {dashboardData?.progression?.current_degree || 'Freshman'}</div>
      
      {/* REAL recent achievements */}
      <h3>Recent Achievements</h3>
      {dashboardData?.achievements?.map(achievement => (
        <div key={achievement.id}>
          {achievement.badge_icon} {achievement.achievement_name}
        </div>
      ))}
      
      {/* REAL recent transcripts */}
      <h3>Recent Courses</h3>
      {dashboardData?.recentTranscripts?.map(transcript => (
        <div key={transcript.id}>
          {transcript.course_code}: {transcript.final_grade}
        </div>
      ))}
    </div>
  )
}
```

---

## 🔧 Step-by-Step Integration Process

### Step 1: Create Service Files
```bash
# Create these files in your project:
src/services/anonymousSellerService.ts
src/services/viralSharingService.ts
src/services/academicService.ts
src/services/baconBankService.ts
```

### Step 2: Replace Static Data in Components
For each component:
1. **Add imports** for the service functions
2. **Add useState** for loading states and data
3. **Add useEffect** to load data when component mounts
4. **Replace hard-coded data** with state variables
5. **Add error handling** with try/catch blocks
6. **Add loading indicators** while data loads

### Step 3: Handle User Interactions
Replace fake button clicks with real API calls:
```typescript
// BEFORE: Fake action
const handleClick = () => {
  alert("This would do something")
}

// AFTER: Real API call
const handleClick = async () => {
  setLoading(true)
  try {
    const result = await someService.doSomething()
    // Update UI with result
    setData(result)
    toast({ title: "Success!" })
  } catch (error) {
    toast({ title: "Error", description: error.message })
  } finally {
    setLoading(false)
  }
}
```

### Step 4: Add Loading States
```typescript
// Show loading while fetching data
if (loading) {
  return <div className="animate-pulse">Loading...</div>
}

// Show error if something went wrong
if (error) {
  return <div className="text-red-500">Error: {error.message}</div>
}
```

---

## 🚀 What This Gets You

**Before Integration:**
- Components show fake data
- Buttons don't do anything real
- No database interaction
- Users can't actually use features

**After Integration:**
- Components show real user data
- Buttons perform actual actions
- Data saves to database
- Users can actually earn bacon, share links, track progress, etc.

**The Result:** Your static demo becomes a **fully functional platform** where users can actually earn money through referrals! 🎓💰

Would you like me to show you how to integrate APIs into any specific component you're working on?