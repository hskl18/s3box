import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"
import {
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider"

// Initialize the Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
})

// Configuration
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || ""
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || ""

export async function signUp(username: string, password: string, email: string) {
  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    })

    const response = await cognitoClient.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error signing up:", error)
    return { success: false, error }
  }
}

export async function confirmSignUp(username: string, confirmationCode: string) {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
    })

    const response = await cognitoClient.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error confirming sign up:", error)
    return { success: false, error }
  }
}

export async function signIn(username: string, password: string) {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })

    const response = await cognitoClient.send(command)
    return {
      success: true,
      data: response,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      accessToken: response.AuthenticationResult?.AccessToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn,
    }
  } catch (error) {
    console.error("Error signing in:", error)
    return { success: false, error }
  }
}

export async function forgotPassword(username: string) {
  try {
    const command = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: username,
    })

    const response = await cognitoClient.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error initiating forgot password:", error)
    return { success: false, error }
  }
}

export async function confirmForgotPassword(username: string, confirmationCode: string, newPassword: string) {
  try {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
    })

    const response = await cognitoClient.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error confirming forgot password:", error)
    return { success: false, error }
  }
}

export async function signOut(accessToken: string) {
  try {
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    })

    const response = await cognitoClient.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error }
  }
}
