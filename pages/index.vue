<template>
  <div class="home">
    <h1>Welcome to Registration App</h1>
    <NuxtLink to="/register" class="register-link">
      Go to Registration
    </NuxtLink>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

h1 {
  color: white;
  margin-bottom: 30px;
}

.register-link {
  padding: 15px 30px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: transform 0.2s;
}

.register-link:hover {
  transform: translateY(-2px);
}
</style>