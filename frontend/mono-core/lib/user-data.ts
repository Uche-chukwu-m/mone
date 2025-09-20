export interface UserResponse {
  question: string;
  answer: string | object;
}

export interface UserOnboardingData {
  responses: UserResponse[];
  timestamp: string;
  completedAt: string;
}

export function collectUserOnboardingData(): UserOnboardingData {
  const responses: UserResponse[] = [];

  // 1. User's first name
  const firstName = localStorage.getItem('userFirstName');
  if (firstName) {
    responses.push({
      question: "What should we call you?",
      answer: firstName
    });
  }

  // 2. User's goal/motivation
  const goal = localStorage.getItem('monoGoal');
  if (goal) {
    responses.push({
      question: "What brings you to Mono today?",
      answer: goal
    });
  }

  // 3. Monthly income after tax
  const income = localStorage.getItem('monthlyIncome');
  if (income) {
    responses.push({
      question: "How much do you earn monthly after tax?",
      answer: `$${income}`
    });
  }

  // 4. Monthly rent
  const rent = localStorage.getItem('monthlyRent');
  if (rent) {
    responses.push({
      question: "How much do you pay for rent monthly?",
      answer: `$${rent}`
    });
  }

  // 5. Debts information
  const debtsString = localStorage.getItem('userDebts');
  if (debtsString) {
    try {
      const debts = JSON.parse(debtsString);
      const hasDebts = Object.keys(debts).length > 0;
      
      if (hasDebts) {
        // Format debt categories with amounts
        const debtCategories = {
          'credit-card': 'Credit card',
          'medical': 'Medical debt',
          'auto': 'Auto loans',
          'buy-now': 'Buy now, pay later',
          'student': 'Student loans',
          'personal': 'Personal loans'
        };

        const formattedDebts = Object.entries(debts).map(([key, amount]) => ({
          category: debtCategories[key as keyof typeof debtCategories] || key,
          amount: `$${amount}`
        }));

        responses.push({
          question: "Do you currently have any debt?",
          answer: {
            hasDebts: true,
            debts: formattedDebts
          }
        });
      } else {
        responses.push({
          question: "Do you currently have any debt?",
          answer: {
            hasDebts: false,
            debts: []
          }
        });
      }
    } catch (error) {
      // If there's an error parsing, assume no debts
      responses.push({
        question: "Do you currently have any debt?",
        answer: {
          hasDebts: false,
          debts: []
        }
      });
    }
  }

  return {
    responses,
    timestamp: new Date().toISOString(),
    completedAt: new Date().toLocaleString()
  };
}

export async function sendUserDataToBackend(userData: UserOnboardingData, accessToken?: string | null) {
  // This is where you'll send the data to your backend with Auth0 token
  console.log('User Onboarding Data to send to backend:', JSON.stringify(userData, null, 2));
  console.log('Access Token provided:', !!accessToken);
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if we have an access token
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/onboarding`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Backend response:', result);
    return result;
  } catch (error) {
    console.error('Error sending data to backend:', error);
    throw error;
  }
}

export function clearUserOnboardingData() {
  // Clear all onboarding data from localStorage
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('monoGoal');
  localStorage.removeItem('monthlyIncome');
  localStorage.removeItem('monthlyRent');
  localStorage.removeItem('userDebts');
}
