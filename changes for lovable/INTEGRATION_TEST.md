# Integration Testing Guide

## 🧪 Complete Integration Verification

This document provides step-by-step testing procedures to verify all University of Bacon platform integrations work correctly.

## ✅ Testing Checklist

### Database Schema Tests

#### 1. Anonymous Seller Protection
```sql
-- Test anonymous profile creation
SELECT create_anonymous_profile('test-listing-123', 'real-user-456');

-- Verify contact lockdown
SELECT * FROM anonymous_seller_profiles WHERE listing_id = 'test-listing-123';
-- Should show anonymous data only

-- Test contact revelation (requires payment confirmation)
SELECT reveal_seller_contact('test-listing-123', 'buyer-789', 'payment-confirmed-abc');
```

#### 2. Viral Sharing System  
```sql
-- Test share link creation
INSERT INTO share_links (listing_id, user_id, platform, tracking_code, share_url)
VALUES ('test-listing-123', 'user-456', 'facebook', 'track123', 'https://bacon.university/share/track123');

-- Test click tracking
SELECT track_share_click('track123', '{"userAgent": "test", "referrer": "facebook.com"}');

-- Verify momentum calculation
SELECT * FROM sharing_momentum WHERE user_id = 'user-456';
```

#### 3. Academic Transcripts System
```sql
-- Test enrollment
INSERT INTO academic_transcripts (user_id, course_code, course_title, department, credit_hours)
VALUES ('user-456', 'SHAR 101', 'Introduction to Viral Sharing', 'Business', 3.0);

-- Test GPA calculation
SELECT calculate_semester_gpa('user-456', 'Fall 2024', '2024-25');

-- Test degree progression
SELECT * FROM degree_progression WHERE user_id = 'user-456';
```

### Service Layer Tests

#### 1. Academic Service
```typescript
// Test enrollment
const transcriptId = await academicService.enrollInCourse(
  'SHAR 101',
  'Introduction to Viral Sharing', 
  'Business School',
  3.0
);
console.log('Enrollment successful:', transcriptId);

// Test dashboard data
const dashboard = await academicService.getDashboard();
console.log('Dashboard loaded:', dashboard.progression?.current_degree);

// Test achievement award
const awarded = await academicService.awardAchievement(
  'networking',
  'First Share',
  'Created your first share link'
);
console.log('Achievement awarded:', awarded);
```

#### 2. Bacon Bank Service
```typescript
// Test balance retrieval
const balance = await baconBankService.getBalance();
console.log('Current balance:', balance.availableBalance);

// Test earnings addition
const earning = await baconBankService.addEarnings(
  25.50,
  'Referral commission from course sale',
  'course-123',
  'referral'
);
console.log('Earnings added:', earning.amount);

// Test withdrawal
const withdrawal = await baconBankService.requestWithdrawal({
  amount: 50.00,
  paymentMethodId: '1',
  estimatedFees: 1.50,
  netAmount: 48.50
});
console.log('Withdrawal requested:', withdrawal.id);
```

#### 3. Viral Sharing Service
```typescript
// Test share link creation
const shareLink = await viralSharingService.createShareLink(
  'course-123',
  'facebook',
  'Check out this amazing course!'
);
console.log('Share link created:', shareLink.share_url);

// Test click tracking
await viralSharingService.trackClick(shareLink.tracking_code, {
  userAgent: navigator.userAgent,
  referrer: 'facebook.com'
});
console.log('Click tracked successfully');

// Test content generation
const content = viralSharingService.generateShareContent(
  'facebook',
  'Advanced Marketing Course',
  45,
  'This course changed my perspective!'
);
console.log('Generated content:', content.content);
```

#### 4. Anonymous Seller Service
```typescript
// Test profile creation
const profile = await anonymousSellerService.createAnonymousProfile(
  'course-123',
  'real-user-456'
);
console.log('Anonymous profile created:', profile.anonymous_name);

// Test profile retrieval
const retrievedProfile = await anonymousSellerService.getAnonymousProfile('course-123');
console.log('Profile retrieved:', retrievedProfile?.verification_level);

// Test contact revelation (should fail without payment)
try {
  const contact = await anonymousSellerService.revealSellerContact(
    'course-123',
    'buyer-789',
    'invalid-payment'
  );
} catch (error) {
  console.log('Contact protection working:', error.message);
}
```

### Custom Hook Tests

#### 1. useAcademicData
```typescript
const TestAcademicHook = () => {
  const { 
    progression, 
    achievements, 
    loading, 
    error,
    enrollInCourse 
  } = useAcademicData();

  useEffect(() => {
    console.log('Academic progression:', progression?.current_degree);
    console.log('Achievements count:', achievements.length);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [progression, achievements, loading, error]);

  const handleEnroll = async () => {
    try {
      const id = await enrollInCourse(
        'TEST 101',
        'Test Course',
        'Test Department'
      );
      console.log('Enrolled with ID:', id);
    } catch (err) {
      console.error('Enrollment failed:', err);
    }
  };

  return <button onClick={handleEnroll}>Test Enrollment</button>;
};
```

#### 2. useBaconBank
```typescript
const TestBankingHook = () => {
  const { 
    balance, 
    transactions, 
    loading, 
    error,
    addEarnings,
    requestWithdrawal 
  } = useBaconBank();

  useEffect(() => {
    console.log('Available balance:', balance?.availableBalance);
    console.log('Transaction count:', transactions.length);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [balance, transactions, loading, error]);

  const handleEarning = async () => {
    try {
      const transaction = await addEarnings(
        10.00,
        'Test earning',
        'test-source'
      );
      console.log('Earning added:', transaction.amount);
    } catch (err) {
      console.error('Add earning failed:', err);
    }
  };

  return <button onClick={handleEarning}>Test Add Earning</button>;
};
```

### Component Integration Tests

#### 1. EnhancedCourseCard
```typescript
const TestCourseCard = () => {
  const mockCourse = {
    id: 'test-course-1',
    item_title: 'Test Course',
    item_description: 'A test course for verification',
    price_min: 100,
    price_max: 200,
    reward_percentage: 20,
    max_degrees: 5,
    status: 'active',
    user_id: 'test-user',
    general_location: 'Test Location',
    verification_level: 'professor_verified' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const handleShare = (courseId: string, shareLink: any) => {
    console.log('Share clicked for course:', courseId);
    console.log('Share link:', shareLink);
  };

  const handleView = (courseId: string) => {
    console.log('View details for course:', courseId);
  };

  return (
    <EnhancedCourseCard
      course={mockCourse}
      onShareClick={handleShare}
      onViewDetails={handleView}
      showAnalytics={true}
    />
  );
};
```

#### 2. ShareIntentModal
```typescript
const TestShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mockCourse = {
    id: 'test-course-1',
    item_title: 'Test Course for Sharing',
    price_min: 150,
    reward_percentage: 25,
    max_degrees: 4
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Test Share Modal
      </button>
      <ShareIntentModal
        course={mockCourse}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
```

#### 3. StudentDashboard
```typescript
const TestDashboard = () => {
  return (
    <StudentDashboard userId="test-user-123" />
  );
};

// Verify dashboard loads:
// - Academic progression data
// - Recent transcripts
// - Achievements
// - Bacon balance integration
// - Sharing momentum
```

#### 4. BaconBank
```typescript
const TestBaconBank = () => {
  return (
    <BaconBank userId="test-user-123" />
  );
};

// Verify banking interface loads:
// - Current balance
// - Transaction history  
// - Withdrawal functionality
// - Payment methods
// - Earning analytics
```

### End-to-End User Flow Tests

#### 1. Complete Course Sharing Flow
```typescript
const TestCompleteFlow = async () => {
  // 1. User views course listing
  console.log('1. Loading course listings...');
  
  // 2. User clicks share on a course
  console.log('2. Creating share link...');
  const shareLink = await viralSharingService.createShareLink(
    'course-123',
    'facebook',
    'Custom message'
  );
  
  // 3. User shares link and someone clicks
  console.log('3. Tracking click...');
  await viralSharingService.trackClick(shareLink.tracking_code);
  
  // 4. Click leads to course enrollment
  console.log('4. Processing enrollment...');
  const transcriptId = await academicService.enrollInCourse(
    'SHAR 101',
    'Viral Sharing Course',
    'Business'
  );
  
  // 5. Enrollment triggers bacon earning
  console.log('5. Adding referral earnings...');
  await baconBankService.addEarnings(
    25.00,
    'Referral commission',
    shareLink.id,
    'referral'
  );
  
  console.log('Complete flow test successful!');
};
```

#### 2. Anonymous Seller Protection Flow
```typescript
const TestAnonymousFlow = async () => {
  // 1. Seller creates course listing
  console.log('1. Creating anonymous profile...');
  const profile = await anonymousSellerService.createAnonymousProfile(
    'listing-456',
    'real-seller-789'
  );
  
  // 2. Buyer views listing (sees anonymous info only)
  console.log('2. Viewing anonymous profile...');
  const anonymousInfo = await anonymousSellerService.getAnonymousProfile('listing-456');
  console.log('Anonymous name:', anonymousInfo?.anonymous_name);
  
  // 3. Buyer attempts to contact seller (should fail)
  console.log('3. Testing contact protection...');
  try {
    await anonymousSellerService.revealSellerContact(
      'listing-456',
      'buyer-123',
      'no-payment'
    );
  } catch (error) {
    console.log('Contact protected:', error.message);
  }
  
  // 4. Buyer makes payment and gets contact info
  console.log('4. Processing payment and revealing contact...');
  const contactInfo = await anonymousSellerService.revealSellerContact(
    'listing-456',
    'buyer-123',
    'confirmed-payment-abc'
  );
  
  console.log('Contact revealed:', contactInfo);
};
```

### Performance Tests

#### 1. Database Query Performance
```sql
-- Test large dataset queries
EXPLAIN ANALYZE SELECT * FROM academic_transcripts 
WHERE user_id = 'test-user' 
ORDER BY created_at DESC 
LIMIT 10;

-- Test viral sharing analytics
EXPLAIN ANALYZE SELECT 
  s.tracking_code,
  COUNT(sc.id) as total_clicks,
  COUNT(DISTINCT sc.ip_address) as unique_clicks
FROM share_links s
LEFT JOIN share_clicks sc ON s.tracking_code = sc.tracking_code
WHERE s.user_id = 'test-user'
GROUP BY s.tracking_code;
```

#### 2. Component Render Performance
```typescript
const TestPerformance = () => {
  const [renderCount, setRenderCount] = useState(0);
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('Component rendered:', renderCount);
  });

  return (
    <div>
      <h3>Render Count: {renderCount}</h3>
      <EnhancedCourseCard course={mockCourse} />
    </div>
  );
};
```

## 🎯 Success Criteria

### Functional Tests
- [ ] All database schemas created successfully
- [ ] All service methods return expected data
- [ ] All components render without errors
- [ ] All hooks manage state correctly
- [ ] Anonymous seller protection prevents contact access
- [ ] Viral sharing creates trackable links
- [ ] Academic progression calculates correctly
- [ ] Bacon bank processes transactions

### Integration Tests  
- [ ] Course sharing creates share links
- [ ] Share clicks get tracked in analytics
- [ ] Successful referrals add bacon earnings
- [ ] Academic achievements get awarded
- [ ] Degree progression advances automatically
- [ ] Anonymous profiles protect seller identity
- [ ] Payment confirmation reveals seller contact

### Performance Tests
- [ ] Database queries execute under 100ms
- [ ] Components render under 200ms
- [ ] Hook state updates don't cause infinite loops
- [ ] Large datasets load efficiently
- [ ] No memory leaks in component mounting/unmounting

### Security Tests
- [ ] RLS policies prevent unauthorized access
- [ ] Anonymous seller data can't be reverse-engineered
- [ ] Contact revelation requires payment confirmation
- [ ] User data isolation works correctly
- [ ] API endpoints validate authentication

## 🚨 Common Issues & Fixes

### Database Issues
```sql
-- Fix RLS policy conflicts
DROP POLICY IF EXISTS "policy_name" ON table_name;
CREATE POLICY "new_policy_name" ON table_name FOR SELECT USING (user_id = auth.uid());

-- Reset sequences if needed
ALTER SEQUENCE table_id_seq RESTART WITH 1;
```

### Service Integration Issues
```typescript
// Fix authentication issues
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error('User not authenticated');

// Fix async race conditions
const results = await Promise.all([
  service1.getData(),
  service2.getData()
]);
```

### Component State Issues
```typescript
// Fix infinite re-renders
useEffect(() => {
  loadData();
}, []); // Empty dependency array

// Fix memory leaks
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);
}, []);
```

## 📊 Testing Results Template

```
# Test Results - [Date]

## Database Schema
- Anonymous Seller Protection: ✅ PASS
- Viral Sharing System: ✅ PASS  
- Academic Transcripts: ✅ PASS

## Service Layer
- Academic Service: ✅ PASS
- Bacon Bank Service: ✅ PASS
- Viral Sharing Service: ✅ PASS
- Anonymous Seller Service: ✅ PASS

## Components
- EnhancedCourseCard: ✅ PASS
- ShareIntentModal: ✅ PASS
- StudentDashboard: ✅ PASS
- BaconBank: ✅ PASS
- CoursesListingPage: ✅ PASS

## Custom Hooks  
- useAcademicData: ✅ PASS
- useBaconBank: ✅ PASS
- useViralSharing: ✅ PASS
- useAnonymousSeller: ✅ PASS

## Integration Flows
- Complete sharing flow: ✅ PASS
- Anonymous seller protection: ✅ PASS
- Academic progression: ✅ PASS
- Bacon earning cycle: ✅ PASS

## Performance
- Database queries: ✅ < 100ms average
- Component renders: ✅ < 200ms average
- Hook state updates: ✅ No infinite loops
- Memory usage: ✅ No leaks detected

## Security
- RLS policies: ✅ PASS
- Contact protection: ✅ PASS
- Data isolation: ✅ PASS
- Authentication: ✅ PASS

Overall Status: ✅ ALL SYSTEMS OPERATIONAL
```

---

*This testing guide ensures the University of Bacon platform transformation is complete and fully functional as a real money-earning social commerce platform.*