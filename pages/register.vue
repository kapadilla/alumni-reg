<template>
  <div class="container">
    <div class="register-card">
      <h1>Register</h1>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username *</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            required
          />
          <span v-if="errors.username" class="error">{{ errors.username[0] }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
          />
          <span v-if="errors.email" class="error">{{ errors.email[0] }}</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input
              id="firstName"
              v-model="formData.first_name"
              type="text"
              required
            />
            <span v-if="errors.first_name" class="error">{{ errors.first_name[0] }}</span>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input
              id="lastName"
              v-model="formData.last_name"
              type="text"
              required
            />
            <span v-if="errors.last_name" class="error">{{ errors.last_name[0] }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password *</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
          />
          <span v-if="errors.password" class="error">{{ errors.password[0] }}</span>
        </div>

        <div class="form-group">
          <label for="password2">Confirm Password *</label>
          <input
            id="password2"
            v-model="formData.password2"
            type="password"
            required
          />
          <span v-if="errors.password2" class="error">{{ errors.password2[0] }}</span>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const formData = ref({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  password2: ''
})

const errors = ref({})
const successMessage = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  errors.value = {}
  successMessage.value = ''
  loading.value = true

  try {
    const response = await axios.post(
      'http://localhost:8000/api/users/register/',
      formData.value
    )
    
    successMessage.value = response.data.message
    
    // Reset form
    formData.value = {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password2: ''
    }
  } catch (error) {
    if (error.response && error.response.data) {
      errors.value = error.response.data
    } else {
      errors.value = { general: ['An error occurred. Please try again.'] }
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h1 {
  margin: 0 0 30px 0;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
}
</style>