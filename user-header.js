// ========== SISTEMA DE LOGIN COM REDIRECIONAMENTO ==========
// Adicionar ao final do script da página de login (login-gym.html)

// Modificar a função de login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const result = db.login(email, password);

    if (result.success) {
        showMessage('login-message', result.message, 'success');
        
        // Salvar usuário no localStorage
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('gymp2_current_user', JSON.stringify(result.user));
        
        // Redirecionar após 1 segundo para a página LOGADA
        setTimeout(() => {
            window.location.href = window.location.origin + '/Menu-inicial-sem-logar.html';
        }, 1000);
    } else {
        showMessage('login-message', result.message, 'error');
    }
});

// Modificar a função de signup
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const result = db.createUser({ name, email, password });

    if (result.success) {
        showMessage('signup-message', result.message, 'success');
        
        // Fazer login automático após criar conta
        setTimeout(() => {
            const loginResult = db.login(email, password);
            if (loginResult.success) {
                localStorage.setItem('currentUser', JSON.stringify(loginResult.user));
                localStorage.setItem('gymp2_current_user', JSON.stringify(loginResult.user));
                window.location.replace('Menu-inicial-sem-logar.html');
            }
        }, 1500);
    } else {
        showMessage('signup-message', result.message, 'error');
    }
});

// ========== ADICIONAR NO SCRIPT DA PÁGINA INICIAL ==========

// Adicionar estilos CSS se não existirem
function addUserHeaderStyles() {
    if (document.getElementById('user-header-styles')) {
        return;
    }

    const styles = `
        <style id="user-header-styles">
            .user-header-container {
                display: flex;
                align-items: center;
                gap: 12px;
                background: rgba(0, 255, 136, 0.1);
                border: 2px solid rgba(0, 255, 136, 0.3);
                border-radius: 30px;
                padding: 6px 16px 6px 6px;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
            }

        
            .user-avatar {
              
                border-radius: 10%;
                background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 200;
                font-size: 10px;
                color: #000;
                border: 1px solid #fff;
                flex-shrink: 0;
            }

       

            .user-name-text {
                font-size: 10px;
                font-weight: 600;
                color: #fff;
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .user-dropdown-menu {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                background: #1a1a1a;
                border: 2px solid rgba(0, 255, 136, 0.3);
                border-radius: 12px;
                padding: 12px;
                min-width: 220px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 3000;
            }

         

            .user-dropdown-info {
                padding: 12px;
                border-bottom: 1px solid rgba(0, 255, 136, 0.2);
                margin-bottom: 8px;
            }

            .user-dropdown-name {
                font-size: 16px;
                font-weight: 700;
                color: #fff;
                margin-bottom: 4px;
            }

            .user-dropdown-email {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }

            .user-dropdown-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #fff;
                text-decoration: none;
                margin-bottom: 4px;
            }

            

            .user-dropdown-item.logout {
                color: #ff4444;
                border-top: 1px solid rgba(255, 68, 68, 0.2);
                margin-top: 8px;
            }

       
            .user-dropdown-icon {
                width: 20px;
                height: 20px;
            }

            /* Estilos para o menu hamburguer quando logado */
            .nav-link i {
                width: 20px;
                text-align: center;
                margin-right: 10px;
            }

            .nav-link[style*="color: #00ff88"] {
                background: rgba(0, 255, 136, 0.1);
                border-radius: 8px;
                margin: 5px 0;
                padding: 12px 15px !important;
            }

            .nav-link[style*="color: #ff4444"] {
                background: rgba(255, 68, 68, 0.1);
                border-radius: 8px;
                margin: 5px 0;
                padding: 12px 15px !important;
            }

            .nav-link[style*="color: #00ff88"]:hover {
                background: rgba(0, 255, 136, 0.2);
                color: #00ff88 !important;
            }

            .nav-link[style*="color: #ff4444"]:hover {
                background: rgba(255, 68, 68, 0.2);
                color: #ff4444 !important;
            }

            @media (max-width: 768px) {
                .user-name-text {
                    display: none;
                }

                .user-header-container {
                    padding: 6px;
                }

                .user-dropdown-menu {
                    min-width: 200px;
                }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
}

// ========== ATUALIZAR MENU HAMBURGUER QUANDO LOGADO ==========
function updateHamburgerMenuForLoggedUser(user) {
    const navigationList = document.querySelector('.navigation-list');
    
    if (!navigationList) {
        console.log('❌ Menu hamburguer não encontrado');
        return;
    }

    // Encontrar o item de login no menu
    const loginItems = navigationList.querySelectorAll('.nav-link');
    let loginItem = null;
    
    loginItems.forEach(item => {
        if (item.textContent.trim() === 'Login' || item.getAttribute('href') === '#espaço-cliente') {
            loginItem = item.closest('.nav-item');
        }
    });
    
    // Se encontrou o item de login, substituir por Perfil
    if (loginItem) {
        const firstName = user.name.split(' ')[0];
        
        loginItem.innerHTML = `
            <a href="#perfil" class="nav-link" style="color: #00ff88; font-weight: 700;">
                <i class="fas fa-user" style="margin-right: 10px;"></i>
                Meu Perfil (${firstName})
            </a>
        `;
        
        // Remover item de logout existente se houver
        const existingLogout = document.getElementById('menuLogoutBtn');
        if (existingLogout) {
            existingLogout.closest('.nav-item').remove();
        }
        
        // Adicionar item de logout
        const logoutItem = document.createElement('li');
        logoutItem.className = 'nav-item';
        logoutItem.innerHTML = `
            <a href="#logout" class="nav-link" style="color: #ff4444;" id="menuLogoutBtn">
                <i class="fas fa-sign-out-alt" style="margin-right: 10px;"></i>
                Sair
            </a>
        `;
        
        navigationList.appendChild(logoutItem);
        
        // Configurar evento de logout no menu
        const menuLogoutBtn = document.getElementById('menuLogoutBtn');
        if (menuLogoutBtn) {
            menuLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Deseja realmente sair da sua conta?')) {
                    localStorage.removeItem('gymp2_current_user');
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                }
            });
        }
        
        console.log('✅ Menu hamburguer atualizado para usuário logado');
    } else {
        console.log('ℹ️ Item de login não encontrado no menu hamburguer');
    }
}

// ========== RESTAURAR MENU HAMBURGUER PADRÃO ==========
function resetHamburgerMenu() {
    const navigationList = document.querySelector('.navigation-list');
    if (!navigationList) return;
    
    // Restaurar item de login se não existir
    const loginItems = navigationList.querySelectorAll('.nav-link');
    let loginExists = false;
    
    loginItems.forEach(item => {
        if (item.textContent.includes('Login') || item.getAttribute('href') === '#espaço-cliente') {
            loginExists = true;
        }
    });
    
    if (!loginExists) {
        // Encontrar onde inserir o login (normalmente após Home)
        const homeItem = Array.from(navigationList.querySelectorAll('.nav-link')).find(item => 
            item.textContent === 'Home' || item.getAttribute('href') === '#home'
        );
        
        if (homeItem) {
            const loginItem = document.createElement('li');
            loginItem.className = 'nav-item';
            loginItem.innerHTML = `
                <a href="#espaço-cliente" class="nav-link">Login</a>
            `;
            homeItem.closest('.nav-item').after(loginItem);
        }
    }
    
    // Remover item de logout se existir
    const logoutItems = navigationList.querySelectorAll('#menuLogoutBtn');
    logoutItems.forEach(item => {
        item.closest('.nav-item').remove();
    });
}

// ========== CRIAR HEADER DE USUÁRIO MANUALMENTE ==========
function createUserHeaderManually(user) {
    const rightControls = document.querySelector('.right-controls');
    
    if (!rightControls) {
        console.error('❌ Container .right-controls não encontrado');
        return;
    }

    // Verificar se já existe um componente de usuário
    if (document.getElementById('userHeaderContainer')) {
        console.log('ℹ️ Header de usuário já existe');
        return;
    }

    // Remover o botão "Login" se existir
    const gymButtons = rightControls.querySelectorAll('.gym-access-btn');
    gymButtons.forEach(btn => {
        if (btn.textContent.includes('Login')) {
            btn.remove();
        }
    });
   
    // Criar as iniciais do usuário
    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const firstName = user.name.split(' ')[0];

    // HTML do componente de usuário
    const userHTML = `
        <div class="user-header-container" id="userHeaderContainer">
            <div class="user-avatar">
                ${initials}
            </div>
            <span class="user-name-text">${firstName}</span>
            
            <div class="user-dropdown-menu" id="userDropdownMenu">
                <div class="user-dropdown-info">
                    <div class="user-dropdown-name">${user.name}</div>
                    <div class="user-dropdown-email">${user.email || 'usuario@gymp2.com'}</div>
                </div>
                
                <a href="#perfil" class="user-dropdown-item">
                    <svg class="user-dropdown-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    Meu Perfil
                </a>
                
                <div class="user-dropdown-item logout" id="logoutBtn">
                    <svg class="user-dropdown-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Sair
                </div>
            </div>
        </div>
    `;

    // Inserir antes do menu hambúrguer
    const menuTrigger = document.getElementById('menuTrigger');
    const userContainer = document.createElement('div');
    userContainer.innerHTML = userHTML;
    
    if (menuTrigger) {
        menuTrigger.parentNode.insertBefore(userContainer.firstElementChild, menuTrigger);
    } else {
        rightControls.appendChild(userContainer.firstElementChild);
    }

    // Configurar eventos
    setupUserEvents();
    
    console.log('✅ Header de usuário criado:', user.name);
}

// ========== CONFIGURAR EVENTOS DO COMPONENTE DE USUÁRIO ==========
function setupUserEvents() {
    const userContainer = document.getElementById('userHeaderContainer');
    const dropdownMenu = document.getElementById('userDropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!userContainer || !dropdownMenu || !logoutBtn) {
        return;
    }

    // Toggle do dropdown
    userContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        userContainer.classList.toggle('active');
    });

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!userContainer.contains(e.target)) {
            userContainer.classList.remove('active');
        }
    });

    // Prevenir fechamento ao clicar no dropdown
    dropdownMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Evento de logout
    logoutBtn.addEventListener('click', () => {
        if (confirm('Deseja realmente sair da sua conta?')) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('gymp2_current_user');
            alert('Logout realizado com sucesso!');
            window.location.reload();
        }
    });

    // Fechar dropdown ao clicar nos links
    const dropdownLinks = dropdownMenu.querySelectorAll('a.user-dropdown-item');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            userContainer.classList.remove('active');
        });
    });
}

// ========== FUNÇÃO PRINCIPAL DE VERIFICAÇÃO DE LOGIN ==========
function checkAndUpdateHeader() {
    const userData = localStorage.getItem('currentUser') || localStorage.getItem('gymp2_current_user');
    
    console.log('🔍 Verificando dados de login...');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            console.log('✅ Usuário detectado:', user.name);
            
            // Atualizar header principal
            createUserHeaderManually(user);
            
            // Atualizar menu hamburguer
            updateHamburgerMenuForLoggedUser(user);
            
        } catch (error) {
            console.error('❌ Erro ao processar dados do usuário:', error);
        }
    } else {
        console.log('ℹ️ Nenhum usuário logado');
        // Garantir que o menu hamburguer esteja no estado padrão
        resetHamburgerMenu();
    }
}

// ========== EXECUTAR QUANDO A PÁGINA CARREGAR ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Iniciando verificação de login...');
    addUserHeaderStyles();
    checkAndUpdateHeader();
});

// Executar também se o documento já estiver carregado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('🔍 Documento já carregado, verificando login...');
    setTimeout(() => {
        addUserHeaderStyles();
        checkAndUpdateHeader();
    }, 100);
}

// ========== OBSERVADOR DE MUDANÇAS NO LOCALSTORAGE ==========
window.addEventListener('storage', (e) => {
    if ((e.key === 'currentUser' || e.key === 'gymp2_current_user') && e.newValue) {
        console.log('🔄 Mudança de login detectada! Atualizando página...');
        setTimeout(() => {
            checkAndUpdateHeader();
        }, 500);
    }
});

// ========== VERIFICAÇÃO PERIÓDICA (PARA DEBUG) ==========
let checkCount = 0;
const checkInterval = setInterval(() => {
    checkCount++;
    
    const userData = localStorage.getItem('currentUser');
    const userContainer = document.getElementById('userHeaderContainer');
    
    if (userData && !userContainer) {
        console.log('⚠️ Usuário logado mas header não existe! Criando...');
        clearInterval(checkInterval);
        checkAndUpdateHeader();
    }
    
    // Parar após 10 verificações
    if (checkCount >= 10) {
        console.log('⏹ Verificação automática finalizada');
        clearInterval(checkInterval);
    }
}, 1000);
