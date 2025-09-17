document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    
    // Botões de acessibilidade
    const highContrastBtn = document.getElementById('high-contrast');
    const normalViewBtn = document.getElementById('normal-view');
    const fontSmallBtn = document.getElementById('font-small');
    const fontNormalBtn = document.getElementById('font-normal');
    const fontLargeBtn = document.getElementById('font-large');
    const fontXLargeBtn = document.getElementById('font-xlarge');
    const deuteranopiaBtn = document.getElementById('deuteranopia');
    const protanopiaBtn = document.getElementById('protanopia');
    const tritanopiaBtn = document.getElementById('tritanopia');
    
    // Estado da aplicação
    let currentMode = 'normal';
    let currentFontSize = 'normal';
    
    // Inicialização
    initApp();
    
    function initApp() {
        // Carregar preferências salvas
        loadPreferences();
        
        // Focar no campo de usuário
        setTimeout(() => {
            usernameInput.focus();
            announceForScreenReader('Página de login carregada. Por favor, preencha seus dados de acesso.');
        }, 100);
        
        // Adicionar event listeners
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Configurações de acessibilidade
        highContrastBtn.addEventListener('click', activateHighContrast);
        normalViewBtn.addEventListener('click', activateNormalView);
        
        // Tamanho da fonte
        fontSmallBtn.addEventListener('click', function() { changeFontSize('small'); });
        fontNormalBtn.addEventListener('click', function() { changeFontSize('normal'); });
        fontLargeBtn.addEventListener('click', function() { changeFontSize('large'); });
        fontXLargeBtn.addEventListener('click', function() { changeFontSize('xlarge'); });
        
        // Modos para daltonismo
        deuteranopiaBtn.addEventListener('click', function() { activateColorMode('deuteranopia'); });
        protanopiaBtn.addEventListener('click', function() { activateColorMode('protanopia'); });
        tritanopiaBtn.addEventListener('click', function() { activateColorMode('tritanopia'); });
        
        // Validação do formulário
        loginForm.addEventListener('submit', handleLogin);
        
        // Validação em tempo real
        usernameInput.addEventListener('blur', validateUsername);
        passwordInput.addEventListener('blur', validatePassword);
        
        // Tecla Enter para navegação
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                passwordInput.focus();
            }
        });
        
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginButton.click();
            }
        });
    }
    
    function activateHighContrast() {
        document.body.classList.add('high-contrast');
        document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
        currentMode = 'high-contrast';
        savePreferences();
        announceForScreenReader('Modo de alto contraste ativado');
    }
    
    function activateNormalView() {
        document.body.classList.remove('high-contrast', 'deuteranopia', 'protanopia', 'tritanopia');
        currentMode = 'normal';
        savePreferences();
        announceForScreenReader('Visualização normal ativada');
    }
    
    function changeFontSize(size) {
        const sizes = {
            'small': '12px',
            'normal': '16px',
            'large': '20px',
            'xlarge': '24px'
        };
        
        // Aplicar o tamanho de fonte ao documento
        document.documentElement.style.setProperty('--font-size', sizes[size]);
        currentFontSize = size;
        savePreferences();
        
        const messages = {
            'small': 'Texto pequeno ativado',
            'normal': 'Texto normal ativado',
            'large': 'Texto grande ativado',
            'xlarge': 'Texto extra grande ativado'
        };
        
        announceForScreenReader(messages[size]);
        
        // Atualizar visualmente os botões para mostrar o estado ativo
        updateFontSizeButtons(size);
    }
    
    function updateFontSizeButtons(activeSize) {
        // Remover a classe active de todos os botões
        const buttons = document.querySelectorAll('.font-size-options button');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar a classe active ao botão correspondente
        const activeButton = document.getElementById(`font-${activeSize}`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
    
    function activateColorMode(mode) {
        document.body.classList.remove('high-contrast', 'deuteranopia', 'protanopia', 'tritanopia');
        document.body.classList.add(mode);
        currentMode = mode;
        savePreferences();
        
        const messages = {
            'deuteranopia': 'Modo para deuteranopia ativado',
            'protanopia': 'Modo para protanopia ativado',
            'tritanopia': 'Modo para tritanopia ativado'
        };
        
        announceForScreenReader(messages[mode]);
    }
    
    function validateUsername() {
        if (!usernameInput.value.trim()) {
            showError(usernameInput, 'Por favor, preencha o campo usuário');
            return false;
        } else {
            clearError(usernameInput);
            return true;
        }
    }
    
    function validatePassword() {
        if (!passwordInput.value.trim()) {
            showError(passwordInput, 'Por favor, preencha o campo senha');
            return false;
        } else {
            clearError(passwordInput);
            return true;
        }
    }
    
    function showError(input, message) {
        // Remover erro anterior se existir
        clearError(input);
        
        // Adicionar classe de erro
        input.classList.add('shake');
        
        // Criar elemento de mensagem de erro
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.id = input.id + '-error';
        
        // Inserir após o campo
        input.parentNode.appendChild(error);
        
        // Anunciar para leitor de tela
        announceForScreenReader(message);
        
        // Remover animação após execução
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
    }
    
    function clearError(input) {
        // Remover mensagem de erro se existir
        const error = document.getElementById(input.id + '-error');
        if (error) {
            error.parentNode.removeChild(error);
        }
        
        // Remover classe de erro
        input.classList.remove('shake');
    }
    
    function handleLogin(e) {
        e.preventDefault();
        
        // Validar campos
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        
        if (!isUsernameValid || !isPasswordValid) {
            return;
        }
        
        // Simular processo de login
        loginButton.textContent = 'Entrando...';
        loginButton.disabled = true;
        
        // Aqui você faria a requisição real para o servidor
        simulateLogin()
            .then(() => {
                showSuccess('Login realizado com sucesso! Redirecionando...');
                announceForScreenReader('Login realizado com sucesso! Redirecionando...');
                
                // Simular redirecionamento
                setTimeout(() => {
                    alert('Login realizado com sucesso! (Esta é uma simulação)');
                    resetForm();
                }, 1500);
            })
            .catch(error => {
                showError(loginButton, error.message);
                loginButton.textContent = 'Entrar';
                loginButton.disabled = false;
            });
    }
    
    function simulateLogin() {
        return new Promise((resolve, reject) => {
            // Simular atraso de rede
            setTimeout(() => {
                // Simular credenciais válidas (em um caso real, isso seria verificado no servidor)
                if (usernameInput.value === 'admin' && passwordInput.value === 'admin') {
                    resolve();
                } else {
                    reject(new Error('Usuário ou senha incorretos'));
                }
            }, 1000);
        });
    }
    
    function showSuccess(message) {
        // Remover mensagens de erro existentes
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.parentNode.removeChild(error));
        
        // Criar elemento de mensagem de sucesso
        const success = document.createElement('div');
        success.className = 'success-message';
        success.textContent = message;
        
        // Inserir antes do formulário
        loginForm.parentNode.insertBefore(success, loginForm);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (success.parentNode) {
                success.parentNode.removeChild(success);
            }
        }, 3000);
    }
    
    function resetForm() {
        loginForm.reset();
        loginButton.textContent = 'Entrar';
        loginButton.disabled = false;
        
        // Remover mensagens de erro
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.parentNode.removeChild(error));
    }
    
    function savePreferences() {
        const preferences = {
            mode: currentMode,
            fontSize: currentFontSize
        };
        
        localStorage.setItem('loginAccessibilityPreferences', JSON.stringify(preferences));
    }
    
    function loadPreferences() {
        const saved = localStorage.getItem('loginAccessibilityPreferences');
        
        if (saved) {
            const preferences = JSON.parse(saved);
            
            // Aplicar modo
            if (preferences.mode === 'high-contrast') {
                activateHighContrast();
            } else if (preferences.mode === 'deuteranopia') {
                activateColorMode('deuteranopia');
            } else if (preferences.mode === 'protanopia') {
                activateColorMode('protanopia');
            } else if (preferences.mode === 'tritanopia') {
                activateColorMode('tritanopia');
            }
            
            // Aplicar tamanho de fonte
            if (preferences.fontSize) {
                changeFontSize(preferences.fontSize);
            }
        }
    }
    
    function announceForScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.classList.add('screen-reader-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
});