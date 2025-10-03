document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVEGAÇÃO ENTRE SEÇÕES =====
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            // Remove classes 'active'
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Adiciona 'active' ao link clicado
            const targetId = this.getAttribute('data-target');
            document.querySelectorAll(`.nav-link[data-target="${targetId}"]`).forEach(matchingLink => {
                matchingLink.classList.add('active');
            });
            
            // Mostra a seção correta com animação
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Reinicializa funcionalidades específicas da seção
                if (targetId === 'missoes') {
                    initMissionFilters();
                    updateProgressBars();
                } else if (targetId === 'metricas') {
                    animateMetrics();
                } else if (targetId === 'recompensas') {
                    initAchievements();
                }
            }
        });
    });

    // ===== FILTROS DE MISSÃO =====
    function initMissionFilters() {
        const filterButtons = document.querySelectorAll('.mission-filters .btn');
        const missionCards = document.querySelectorAll('[data-category]');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Atualiza botão ativo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtra missões com animação
                missionCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ===== ANIMAÇÃO DAS BARRAS DE PROGRESSO =====
    function updateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = width;
            }, 500);
        });
    }

    // ===== AÇÕES DOS BOTÕES DE MISSÃO =====
    function initMissionActions() {
        // Botão "Começar" missão
        document.addEventListener('click', function(e) {
            if (e.target.textContent.includes('🚀 Começar')) {
                e.preventDefault();
                showMissionStartModal(e.target);
            }
            
            // Botão "Ver Detalhes"
            if (e.target.textContent.includes('📊 Ver Detalhes')) {
                e.preventDefault();
                showMissionDetails(e.target);
            }
            
            // Botão "Acelerar"
            if (e.target.textContent.includes('⚡ Acelerar')) {
                e.preventDefault();
                showAccelerateModal(e.target);
            }
            
            // Botão "Ativar Boost"
            if (e.target.textContent.includes('💎 Ativar Boost')) {
                e.preventDefault();
                showBoostModal(e.target);
            }
            
            // Botão "Resgatar Recompensa" (missão completada)
            if (e.target.textContent.includes('🎁 Resgatar Recompensa')) {
                e.preventDefault();
                showMissionRewardModal(e.target);
            }
            
            // Botão "Ver Relatório" (missão completada)
            if (e.target.textContent.includes('📊 Ver Relatório')) {
                e.preventDefault();
                showMissionReportModal(e.target);
            }
        });
    }

    // ===== SISTEMA DE MODAIS PERSONALIZADOS =====
    function showSwiftModal(options) {
        const modal = document.getElementById('swiftModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        const confirmBtn = document.getElementById('confirmBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        
        // Remove classes anteriores
        modal.className = 'modal fade';
        
        // Configura o modal
        modalIcon.textContent = options.icon || 'ℹ️';
        modalTitle.textContent = options.title || 'Informação';
        modalContent.innerHTML = options.content || '';
        
        // Adiciona classe do tipo
        if (options.type) {
            modal.classList.add(`modal-${options.type}`);
        }
        
        // Configura botões
        if (options.showCancel !== false) {
            cancelBtn.style.display = 'block';
            cancelBtn.textContent = options.cancelText || 'Cancelar';
        } else {
            cancelBtn.style.display = 'none';
        }
        
        confirmBtn.textContent = options.confirmText || 'Confirmar';
        confirmBtn.className = `btn ${options.confirmClass || 'btn-primary'}`;
        
        // Remove listeners anteriores
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        const newConfirmBtn = document.getElementById('confirmBtn');
        
        // Adiciona novo listener
        newConfirmBtn.addEventListener('click', () => {
            if (options.onConfirm) {
                options.onConfirm();
            }
            bootstrap.Modal.getInstance(modal)?.hide();
        });
        
        // Mostra o modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        return bsModal;
    }

    // ===== MODAIS DE AÇÃO =====
    function showMissionStartModal(button) {
        const missionCard = button.closest('.mission-card');
        const missionTitle = missionCard.querySelector('.card-title').textContent;
        const missionReward = missionCard.querySelector('.mission-reward').textContent;
        
        showSwiftModal({
            icon: '🚀',
            title: 'Iniciar Missão',
            type: 'confirm',
            content: `
                <div class="modal-mission-info">
                    <div class="modal-mission-header">
                        <div class="modal-mission-title">${missionTitle}</div>
                        <div class="modal-mission-reward">${missionReward}</div>
                    </div>
                    <div class="modal-section">
                        <h6>⚠️ Importante:</h6>
                        <ul>
                            <li>Ao iniciar, você terá um prazo específico para completar</li>
                            <li>O progresso será monitorado em tempo real</li>
                            <li>Você pode acelerar usando pontos de boost</li>
                            <li>Missões abandonadas afetam seu rating</li>
                        </ul>
                    </div>
                    <div class="modal-benefits">
                        <h6>🎁 Benefícios ao completar:</h6>
                        <ul>
                            <li>XP e bônus financeiro</li>
                            <li>Melhoria no ranking nacional</li>
                            <li>Desbloqueio de novas missões</li>
                            <li>Conquistas especiais</li>
                        </ul>
                    </div>
                </div>
            `,
            confirmText: '🚀 Iniciar Missão',
            confirmClass: 'btn-success',
            onConfirm: () => {
                // Simula início da missão
                button.textContent = '⏳ Iniciando...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = '🔄 Em Andamento';
                    button.classList.remove('btn-primary');
                    button.classList.add('btn-warning');
                    
                    // Adiciona barra de progresso
                    addProgressBar(missionCard);
                    
                    showNotification('✅ Missão iniciada com sucesso!', 'success');
                }, 2000);
            }
        });
    }

    function showMissionDetails(button) {
        const missionCard = button.closest('.mission-card');
        const missionTitle = missionCard.querySelector('.card-title').textContent;
        
        showSwiftModal({
            icon: '📊',
            title: 'Detalhes da Missão',
            type: 'info',
            showCancel: false,
            content: `
                <div class="modal-mission-info">
                    <div class="modal-mission-header">
                        <div class="modal-mission-title">${missionTitle}</div>
                    </div>
                    <div class="modal-section">
                        <h6>📈 Estatísticas Disponíveis:</h6>
                        <ul>
                            <li>Histórico de tentativas anteriores</li>
                            <li>Taxa de sucesso de outros vendedores</li>
                            <li>Tempo médio de conclusão</li>
                            <li>Ranking de desempenho</li>
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h6>💡 Estratégias Recomendadas:</h6>
                        <ul>
                            <li>Foque nos horários de maior movimento</li>
                            <li>Use técnicas de cross-selling</li>
                            <li>Mantenha contato próximo com clientes VIP</li>
                            <li>Acompanhe métricas diariamente</li>
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h6>👥 Dicas da Comunidade:</h6>
                        <ul>
                            <li>"Comece cedo pela manhã" - João (Rating 1350)</li>
                            <li>"Combine com promoções" - Maria (Rating 1280)</li>
                            <li>"Use o boost nos finais de semana" - Ana (Rating 1290)</li>
                        </ul>
                    </div>
                </div>
            `,
            confirmText: 'Entendi',
            confirmClass: 'btn-primary'
        });
    }

    function showAccelerateModal(button) {
        showSwiftModal({
            icon: '⚡',
            title: 'Acelerar Missão',
            type: 'warning',
            content: `
                <div class="modal-mission-info">
                    <div class="modal-section">
                        <h6>🚀 Boost de Aceleração:</h6>
                        <p>Use 50 pontos de boost para acelerar significativamente o progresso da sua missão atual.</p>
                    </div>
                    <div class="modal-benefits">
                        <h6>✨ Benefícios inclusos:</h6>
                        <ul>
                            <li>+25% de progresso instantâneo</li>
                            <li>Dicas exclusivas personalizadas</li>
                            <li>Suporte prioritário via chat</li>
                            <li>Multiplicador de XP por 2 horas</li>
                        </ul>
                    </div>
                    <div class="modal-requirements">
                        <h6>💰 Custo:</h6>
                        <p>50 pontos de boost (você tem: 127 pontos disponíveis)</p>
                    </div>
                </div>
            `,
            confirmText: '⚡ Usar Boost',
            confirmClass: 'btn-warning',
            onConfirm: () => simulateAcceleration(button)
        });
    }

    function showBoostModal(button) {
        showSwiftModal({
            icon: '💎',
            title: 'Boost Premium',
            type: 'confirm',
            content: `
                <div class="modal-mission-info">
                    <div class="modal-section">
                        <h6>👑 Boost Premium Exclusivo:</h6>
                        <p>Ative o boost mais poderoso disponível para maximizar seus resultados!</p>
                    </div>
                    <div class="modal-benefits">
                        <h6>🌟 Benefícios Premium:</h6>
                        <ul>
                            <li>Dobrar XP e recompensas por 24h</li>
                            <li>Estender prazo da missão em 3 dias</li>
                            <li>Acesso às estratégias VIP exclusivas</li>
                            <li>Suporte dedicado 24/7</li>
                            <li>Multiplicador de rating por 48h</li>
                            <li>Acesso antecipado a novas missões</li>
                        </ul>
                    </div>
                    <div class="modal-requirements">
                        <h6>💎 Investimento:</h6>
                        <p>100 pontos premium (você tem: 89 pontos disponíveis)</p>
                    </div>
                    <div class="modal-warning-text">
                        <strong>⚠️ Atenção:</strong> Você não possui pontos premium suficientes. Você pode adquirir mais pontos completando missões especiais ou através da loja premium.
                    </div>
                </div>
            `,
            confirmText: '💎 Ver Loja Premium',
            confirmClass: 'btn-gradient',
            onConfirm: () => {
                showNotification('🏪 Redirecionando para a loja premium...', 'info');
                // Aqui redirecionaria para a loja premium
            }
        });
    }

    // ===== SIMULAÇÕES DE AÇÃO =====
    function addProgressBar(missionCard) {
        const cardBody = missionCard.querySelector('.card-body');
        
        if (!cardBody.querySelector('.progress-section')) {
            const progressHTML = `
                <div class="progress-section">
                    <div class="progress-header">
                        <span class="progress-label">Progresso: 0/50 unidades</span>
                        <span class="progress-percentage">0%</span>
                    </div>
                    <div class="progress mb-2">
                        <div class="progress-bar bg-primary" style="width: 0%"></div>
                    </div>
                </div>
            `;
            
            cardBody.querySelector('.card-text').insertAdjacentHTML('afterend', progressHTML);
        }
    }

    function simulateAcceleration(button) {
        button.textContent = '⚡ Acelerando...';
        button.disabled = true;
        
        const missionCard = button.closest('.mission-card');
        const progressBar = missionCard.querySelector('.progress-bar');
        const progressLabel = missionCard.querySelector('.progress-label');
        const progressPercentage = missionCard.querySelector('.progress-percentage');
        
        if (progressBar) {
            setTimeout(() => {
                const currentWidth = parseInt(progressBar.style.width) || 67;
                const newWidth = Math.min(currentWidth + 25, 100);
                
                progressBar.style.width = newWidth + '%';
                progressLabel.textContent = `Progresso: ${Math.floor(newWidth)}/100 unidades`;
                progressPercentage.textContent = newWidth + '%';
                
                // Verifica se a missão foi completada
                if (newWidth >= 100) {
                    completeMission(missionCard);
                } else {
                    button.textContent = '⚡ Acelerar';
                    button.disabled = false;
                }
                
                showNotification('⚡ Boost aplicado! +25% de progresso', 'success');
            }, 2000);
        }
    }

    // ===== FUNÇÃO PARA COMPLETAR MISSÃO =====
    function completeMission(missionCard) {
        // Remove classe de ativa e adiciona classe de completa
        missionCard.classList.remove('mission-active');
        missionCard.classList.add('mission-completed');
        
        // Atualiza o badge
        const badge = missionCard.querySelector('.mission-badge');
        if (badge) {
            badge.textContent = '✅ Completa';
            badge.className = 'mission-badge mission-badge-completed';
        }
        
        // Atualiza a recompensa para mostrar que foi ganha
        const reward = missionCard.querySelector('.mission-reward');
        if (reward) {
            reward.classList.add('completed');
            reward.innerHTML = reward.innerHTML + ' ✅';
        }
        
        // Remove a barra de progresso e substitui por estatísticas de conclusão
        const progressSection = missionCard.querySelector('.progress-section');
        if (progressSection) {
            progressSection.innerHTML = `
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">Completado em:</span>
                        <span class="stat-value">Hoje!</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Performance:</span>
                        <span class="stat-value text-success">Excelente ⭐</span>
                    </div>
                </div>
            `;
        }
        
        // Atualiza os botões de ação
        const missionActions = missionCard.querySelector('.mission-actions');
        if (missionActions) {
            missionActions.innerHTML = `
                <button class="btn btn-sm btn-success">🎁 Resgatar Recompensa</button>
                <button class="btn btn-sm btn-outline-info">📊 Ver Relatório</button>
            `;
        }
        
        // Atualiza informações de tempo
        const timeRemaining = missionCard.querySelector('.time-remaining span');
        if (timeRemaining) {
            timeRemaining.innerHTML = '🎉 Completada hoje!';
        }
        
        // Mostra notificação de conclusão
        showNotification('🎉 Missão completada com sucesso! Recompensa disponível para resgate.', 'success');
        
        // Mostra modal de parabenização
        setTimeout(() => {
            showMissionCompletedModal(missionCard);
        }, 1000);
    }

    // ===== MODAL DE MISSÃO COMPLETADA =====
    function showMissionCompletedModal(missionCard) {
        const missionTitle = missionCard.querySelector('.card-title').textContent;
        const missionReward = missionCard.querySelector('.mission-reward').textContent.replace(' ✅', '');
        
        showSwiftModal({
            icon: '🎉',
            title: 'Missão Completada!',
            type: 'success',
            showCancel: false,
            content: `
                <div class="modal-mission-info">
                    <div class="modal-mission-header">
                        <div class="modal-mission-title">${missionTitle}</div>
                        <div class="modal-mission-reward">${missionReward}</div>
                    </div>
                    <div class="modal-benefits">
                        <h6>🏆 Parabéns! Você conquistou:</h6>
                        <ul>
                            <li>XP e bônus financeiro conforme prometido</li>
                            <li>Melhoria no seu ranking nacional</li>
                            <li>Desbloqueio de novas missões exclusivas</li>
                            <li>Progresso nas conquistas Swift</li>
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h6>🎁 Próximos Passos:</h6>
                        <ul>
                            <li>Clique em "Resgatar Recompensa" para receber seu bônus</li>
                            <li>Veja o relatório detalhado da sua performance</li>
                            <li>Explore novas missões disponíveis</li>
                            <li>Continue subindo no ranking!</li>
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h6>📈 Impacto no seu perfil:</h6>
                        <p>Esta conquista aumentou seu rating e desbloqueou benefícios exclusivos no sistema Swift!</p>
                    </div>
                </div>
            `,
            confirmText: '🎁 Ir para Recompensas',
            confirmClass: 'btn-success',
            onConfirm: () => {
                // Muda para a aba de recompensas
                const recompensasLink = document.querySelector('[data-target="recompensas"]');
                if (recompensasLink) {
                    recompensasLink.click();
                }
            }
        });
    }

    // ===== MODAL DE RESGATAR RECOMPENSA DA MISSÃO =====
    function showMissionRewardModal(button) {
        const missionCard = button.closest('.mission-card');
        const missionTitle = missionCard.querySelector('.card-title').textContent;
        const missionReward = missionCard.querySelector('.mission-reward').textContent.replace(' ✅', '');
        
        showSwiftModal({
            icon: '🎁',
            title: 'Resgatar Recompensa da Missão',
            type: 'success',
            content: `
                <div class="modal-mission-info">
                    <div class="modal-mission-header">
                        <div class="modal-mission-title">${missionTitle}</div>
                        <div class="modal-mission-reward">${missionReward}</div>
                    </div>
                    <div class="modal-section">
                        <h6>🏆 Missão Completada com Sucesso!</h6>
                        <p>Você cumpriu todos os objetivos desta missão e agora pode resgatar sua recompensa.</p>
                    </div>
                    <div class="modal-benefits">
                        <h6>💰 Detalhes da Recompensa:</h6>
                        <ul>
                            <li>XP será creditado imediatamente</li>
                            <li>Bônus financeiro em até 2 dias úteis</li>
                            <li>Melhoria automática no ranking</li>
                            <li>Desbloqueio de novas oportunidades</li>
                        </ul>
                    </div>
                    <div class="modal-requirements">
                        <h6>📋 Confirmação:</h6>
                        <p>Ao resgatar, a recompensa será processada e não poderá ser cancelada. O valor será creditado na conta cadastrada no RH.</p>
                    </div>
                </div>
            `,
            confirmText: '🎁 Resgatar Agora',
            confirmClass: 'btn-success',
            onConfirm: () => {
                // Processa o resgate da recompensa
                processMissionReward(missionCard, button);
            }
        });
    }

    // ===== MODAL DE RELATÓRIO DA MISSÃO =====
    function showMissionReportModal(button) {
        const missionCard = button.closest('.mission-card');
        const missionTitle = missionCard.querySelector('.card-title').textContent;
        
        showSwiftModal({
            icon: '📊',
            title: 'Relatório de Performance',
            type: 'info',
            showCancel: false,
            content: `
                <div class="modal-mission-info">
                    <div class="modal-mission-header">
                        <div class="modal-mission-title">${missionTitle}</div>
                    </div>
                    <div class="modal-section">
                        <h6>📈 Estatísticas de Conclusão:</h6>
                        <ul>
                            <li>Tempo total: 2 dias (de 7 disponíveis)</li>
                            <li>Eficiência: 95% acima da média</li>
                            <li>Performance: Excelente ⭐⭐⭐⭐⭐</li>
                            <li>Posição no ranking desta missão: #3</li>
                        </ul>
                    </div>
                    <div class="modal-benefits">
                        <h6>🏆 Conquistas Desbloqueadas:</h6>
                        <ul>
                            <li>Vendedor Rápido (completou em menos de 50% do tempo)</li>
                            <li>Eficiência Máxima (acima de 90% de performance)</li>
                            <li>Destaque Semanal (entre os 5 melhores)</li>
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h6>💡 Feedback Personalizado:</h6>
                        <p>Excelente trabalho! Sua estratégia de focar nos horários de pico e usar técnicas de upselling foi muito eficaz. Continue assim para alcançar o próximo nível!</p>
                    </div>
                    <div class="modal-section">
                        <h6>🎯 Próximas Recomendações:</h6>
                        <ul>
                            <li>Experimente a missão "Linguiça Toscana" - alta compatibilidade</li>
                            <li>Considere ativar um boost para a próxima missão especial</li>
                            <li>Você está a 260 pontos do rank Diamante!</li>
                        </ul>
                    </div>
                </div>
            `,
            confirmText: 'Entendi',
            confirmClass: 'btn-primary'
        });
    }

    // ===== PROCESSAR RESGATE DE RECOMPENSA =====
    function processMissionReward(missionCard, button) {
        button.textContent = '⏳ Processando...';
        button.disabled = true;
        
        setTimeout(() => {
            // Substitui o botão por um indicador de resgatado
            button.textContent = '✅ Resgatado';
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-success');
            button.disabled = true;
            
            // Adiciona uma nova recompensa às recompensas disponíveis
            addMissionRewardToRewards(missionCard);
            
            showNotification('🎉 Recompensa resgatada com sucesso! Verifique a aba Recompensas.', 'success');
        }, 2000);
    }

    // ===== ADICIONAR RECOMPENSA À ABA RECOMPENSAS =====
    function addMissionRewardToRewards(missionCard) {
        const missionTitle = missionCard.querySelector('.card-title').textContent;
        const rewardContainer = document.querySelector('#disponiveis .row');
        
        if (rewardContainer) {
            const newReward = document.createElement('div');
            newReward.className = 'col-md-6 mb-4';
            newReward.innerHTML = `
                <div class="card reward-card reward-available">
                    <div class="reward-glow"></div>
                    <div class="card-body">
                        <div class="reward-icon">🏆</div>
                        <h5 class="card-title">Recompensa: ${missionTitle}</h5>
                        <p class="card-text">Parabéns! Você completou a missão "${missionTitle}" e ganhou esta recompensa.</p>
                        <div class="reward-value">R$ 200,00 + 150 XP</div>
                        <div class="reward-details">
                            <span>🎉 Disponível agora!</span>
                            <button class="btn btn-success btn-sm">🎁 Resgatar</button>
                        </div>
                    </div>
                </div>
            `;
            
            rewardContainer.insertBefore(newReward, rewardContainer.firstChild);
        }
    }

    function activateBoost(button) {
        button.textContent = '💎 Ativando...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = '🔥 Boost Ativo';
            button.classList.add('btn-success');
            
            const missionCard = button.closest('.mission-card');
            missionCard.classList.add('mission-boosted');
            
            showNotification('💎 Boost Premium ativado! XP e recompensas dobrados!', 'premium');
        }, 2000);
    }

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        // Cores por tipo
        const colors = {
            success: '#198754',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#0dcaf0',
            premium: 'linear-gradient(45deg, #ffd700, #ff6b35)'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animação de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove após 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // ===== CONTADOR REGRESSIVO =====
    function startCountdowns() {
        const countdowns = document.querySelectorAll('.time-remaining span');
        
        countdowns.forEach(countdown => {
            if (countdown.textContent.includes('dias')) {
                updateCountdown(countdown);
                setInterval(() => updateCountdown(countdown), 1000);
            }
        });
    }

    function updateCountdown(element) {
        // Simula contagem regressiva (em produção, usar dados reais)
        const text = element.textContent;
        if (text.includes('3 dias, 12h')) {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            element.textContent = `⏰ 3 dias, ${11-Math.floor(minutes/60)}h ${59-minutes}m ${60-seconds}s restantes`;
        }
    }

    // ===== ABAS DE RECOMPENSAS =====
    function initRewardTabs() {
        const tabButtons = document.querySelectorAll('.rewards-tabs .btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Atualiza botões ativos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Atualiza conteúdo das abas
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // ===== AÇÕES DE RECOMPENSAS =====
    function initRewardActions() {
        document.addEventListener('click', function(e) {
            // Botão Resgatar
            if (e.target.textContent.includes('🎁 Resgatar')) {
                e.preventDefault();
                redeemReward(e.target);
            }
            
            // Botão Ativar XP
            if (e.target.textContent.includes('🚀 Ativar')) {
                e.preventDefault();
                activateXPBoost(e.target);
            }
            
            // Botão VIP
            if (e.target.textContent.includes('👑 Ativar VIP')) {
                e.preventDefault();
                activateVIP(e.target);
            }
            
            // Botão QR Code
            if (e.target.textContent.includes('📱 Gerar QR')) {
                e.preventDefault();
                generateQRCode(e.target);
            }
        });
    }

    // ===== FUNÇÕES DE RECOMPENSA =====
    function redeemReward(button) {
        const rewardCard = button.closest('.reward-card');
        const rewardTitle = rewardCard.querySelector('.card-title').textContent;
        const rewardValue = rewardCard.querySelector('.reward-value').textContent;
        const rewardDesc = rewardCard.querySelector('.card-text').textContent;
        
        showSwiftModal({
            icon: '💰',
            title: 'Resgatar Recompensa',
            type: 'success',
            content: `
                <div class="modal-mission-info">
                    <div class="modal-mission-header">
                        <div class="modal-mission-title">${rewardTitle}</div>
                        <div class="modal-mission-reward">${rewardValue}</div>
                    </div>
                    <div class="modal-section">
                        <h6>📋 Descrição:</h6>
                        <p>${rewardDesc}</p>
                    </div>
                    <div class="modal-benefits">
                        <h6>✅ Confirmação de Resgate:</h6>
                        <ul>
                            <li>O valor será creditado em sua conta</li>
                            <li>Prazo: até 2 dias úteis</li>
                            <li>Você receberá confirmação por email</li>
                            <li>O resgate não poderá ser cancelado</li>
                        </ul>
                    </div>
                    <div class="modal-requirements">
                        <h6>🏦 Informações de Pagamento:</h6>
                        <p>Será creditado na conta cadastrada no RH: *****.***7-89</p>
                    </div>
                </div>
            `,
            confirmText: '💰 Confirmar Resgate',
            confirmClass: 'btn-success',
            onConfirm: () => {
                button.textContent = '⏳ Processando...';
                button.disabled = true;
                
                setTimeout(() => {
                    // Move para o histórico
                    moveToHistory(rewardCard);
                    showNotification(`🎉 Recompensa resgatada! ${rewardValue} será creditado em até 2 dias úteis.`, 'success');
                }, 2000);
            }
        });
    }

    function activateXPBoost(button) {
        showSwiftModal({
            icon: '⚡',
            title: 'Boost de XP Duplo',
            type: 'confirm',
            content: `
                <div class="modal-mission-info">
                    <div class="modal-section">
                        <h6>🚀 Boost de XP Duplo:</h6>
                        <p>Ative 24 horas de XP em dobro para maximizar seus ganhos em todas as atividades!</p>
                    </div>
                    <div class="modal-benefits">
                        <h6>⚡ Benefícios:</h6>
                        <ul>
                            <li>XP dobrado em todas as missões</li>
                            <li>XP dobrado em vendas</li>
                            <li>XP dobrado em avaliações</li>
                            <li>Boost aplicado retroativamente</li>
                            <li>Notificações de progresso em tempo real</li>
                        </ul>
                    </div>
                    <div class="modal-requirements">
                        <h6>⏰ Duração:</h6>
                        <p>24 horas a partir do momento da ativação</p>
                    </div>
                    <div class="modal-section">
                        <h6>💡 Dica Pro:</h6>
                        <p>Para maximizar o boost, ative durante um dia de alta atividade e complete o máximo de missões possível!</p>
                    </div>
                </div>
            `,
            confirmText: '🚀 Ativar Boost',
            confirmClass: 'btn-success',
            onConfirm: () => {
                button.textContent = '⚡ Ativando...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = '🔥 Ativo (24h)';
                    button.classList.remove('btn-success');
                    button.classList.add('btn-warning');
                    
                    // Adiciona indicador visual no cabeçalho
                    addActiveBoostIndicator();
                    
                    showNotification('🔥 Boost de XP ativado! XP em dobro pelas próximas 24 horas!', 'success');
                }, 2000);
            }
        });
    }

    function activateVIP(button) {
        showSwiftModal({
            icon: '👑',
            title: 'Status VIP Premium',
            type: 'confirm',
            content: `
                <div class="modal-mission-info">
                    <div class="modal-section">
                        <h6>👑 Status VIP Premium:</h6>
                        <p>Ganhe acesso exclusivo ao clube VIP Swift com benefícios únicos por 30 dias!</p>
                    </div>
                    <div class="modal-benefits">
                        <h6>🌟 Benefícios VIP:</h6>
                        <ul>
                            <li>Missões exclusivas com recompensas maiores</li>
                            <li>Suporte prioritário 24/7</li>
                            <li>Recompensas especiais mensais</li>
                            <li>Acesso antecipado a novidades</li>
                            <li>Badge VIP no seu perfil</li>
                            <li>Participação em eventos exclusivos</li>
                            <li>Desconto de 20% na loja Swift</li>
                        </ul>
                    </div>
                    <div class="modal-requirements">
                        <h6>⏰ Duração:</h6>
                        <p>30 dias corridos a partir da ativação</p>
                    </div>
                    <div class="modal-section">
                        <h6>🎁 Bônus de Boas-vindas VIP:</h6>
                        <p>Ganhe 500 XP + R$ 100 de bônus imediatamente!</p>
                    </div>
                </div>
            `,
            confirmText: '👑 Ativar VIP',
            confirmClass: 'btn-gradient',
            onConfirm: () => {
                button.textContent = '👑 Ativando...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = '✨ VIP Ativo';
                    button.classList.add('btn-success');
                    
                    // Atualiza perfil do usuário
                    updateUserProfileVIP();
                    
                    showNotification('👑 Status VIP ativado! Bem-vindo ao clube exclusivo Swift!', 'premium');
                }, 3000);
            }
        });
    }

    function generateQRCode(button) {
        button.textContent = '📱 Gerando...';
        button.disabled = true;
        
        setTimeout(() => {
            // Atualiza a data do voucher
            const voucherDate = document.getElementById('voucherDate');
            if (voucherDate) {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 30);
                voucherDate.textContent = futureDate.toLocaleDateString('pt-BR');
            }
            
            // Mostra o modal de QR Code
            const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
            qrModal.show();
            
            button.textContent = '✅ QR Gerado';
            button.classList.add('btn-success');
            
            showNotification('📱 QR Code gerado! Mostre na loja parceira para usar o voucher.', 'success');
        }, 1500);
    }

    // ===== FUNÇÃO PARA DOWNLOAD DO QR =====
    function downloadQR() {
        // Simula download do QR Code
        showNotification('📥 QR Code salvo na galeria!', 'success');
        
        // Em uma implementação real, aqui você geraria e baixaria o QR Code
        console.log('Download do QR Code simulado');
    }

    // ===== FUNÇÕES AUXILIARES =====
    function moveToHistory(rewardCard) {
        // Clona o card e move para o histórico
        const clone = rewardCard.cloneNode(true);
        clone.classList.remove('reward-available', 'reward-premium');
        clone.classList.add('reward-claimed');
        
        // Atualiza o conteúdo
        const icon = clone.querySelector('.reward-icon');
        icon.textContent = '✅';
        icon.classList.add('grayscale');
        
        const button = clone.querySelector('.btn-success, .btn-gradient');
        button.textContent = '💳 Resgatado';
        button.classList.remove('btn-success', 'btn-gradient');
        button.classList.add('btn-outline-secondary');
        button.disabled = true;
        
        const details = clone.querySelector('.reward-details span');
        details.innerHTML = '<span class="status-ganho">🎉 Resgatado hoje</span>';
        
        // Adiciona ao histórico
        const historicoTab = document.querySelector('#historico .row');
        if (historicoTab) {
            historicoTab.insertBefore(clone, historicoTab.firstChild);
        }
        
        // Remove o card original
        rewardCard.remove();
    }

    function addActiveBoostIndicator() {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile && !userProfile.querySelector('.boost-indicator')) {
            const boostIndicator = document.createElement('div');
            boostIndicator.className = 'boost-indicator';
            boostIndicator.innerHTML = '🔥 XP Boost Ativo';
            boostIndicator.style.cssText = `
                background: linear-gradient(45deg, #ff6b35, #ffd700);
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
                margin-top: 10px;
                text-align: center;
                animation: pulse 2s infinite;
            `;
            userProfile.appendChild(boostIndicator);
        }
    }

    function updateUserProfileVIP() {
        const userProfile = document.querySelector('.user-profile');
        const userName = userProfile.querySelector('strong');
        if (userName && !userName.textContent.includes('👑')) {
            userName.textContent = '👑 ' + userName.textContent + ' (VIP)';
            userName.style.color = '#ffd700';
        }
    }



    // ===== ANIMAÇÕES DE CONQUISTAS =====
    function initAchievements() {
        const achievementCards = document.querySelectorAll('.achievement-card:not(.locked)');
        
        achievementCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    // ===== ANIMAÇÕES DE MÉTRICAS =====
    function animateMetrics() {
        // Anima barras de progresso
        const progressBars = document.querySelectorAll('#metricas .progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 2s ease-out';
                bar.style.width = width;
            }, 300);
        });

        // Anima barras do gráfico
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach((bar, index) => {
            const height = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => {
                bar.style.transition = 'height 1.5s ease-out';
                bar.style.height = height;
            }, 500 + (index * 100));
        });

        // Anima barras de atividade
        const activityBars = document.querySelectorAll('.activity-bar');
        activityBars.forEach((bar, index) => {
            const height = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => {
                bar.style.transition = 'height 1s ease-out';
                bar.style.height = height;
            }, 800 + (index * 80));
        });

        // Anima números grandes
        animateNumbers();
    }

    function animateNumbers() {
        const animateNumber = (element, targetValue, duration = 2000) => {
            const startValue = 0;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
                
                element.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        };

        // Anima números específicos
        const ratingElement = document.querySelector('.current-rating');
        if (ratingElement) {
            animateNumber(ratingElement, 4.8, 2000);
        }

        const missionsElement = document.querySelector('.big-number');
        if (missionsElement) {
            animateNumber(missionsElement, 12, 1500);
        }

        // Anima valores monetários
        const salesValue = document.querySelector('.stat-value');
        if (salesValue && salesValue.textContent.includes('R$')) {
            let currentValue = 0;
            const targetValue = 45230;
            const duration = 2500;
            const startTime = performance.now();
            
            function updateMoney(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                currentValue = Math.floor(targetValue * easeOutQuart);
                
                salesValue.textContent = `R$ ${currentValue.toLocaleString()}`;
                
                if (progress < 1) {
                    requestAnimationFrame(updateMoney);
                }
            }
            
            requestAnimationFrame(updateMoney);
        }
    }

    // ===== TOOLTIPS INTERATIVOS =====
    function initTooltips() {
        // Adiciona tooltips aos cards de métrica
        const metricCards = document.querySelectorAll('.metric-card.enhanced');
        
        metricCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Adiciona interatividade às barras do gráfico
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            bar.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const label = this.querySelector('.bar-label').textContent;
                showNotification(`📊 ${label}: R$ ${parseInt(value).toLocaleString()}`, 'info');
            });
        });
    }

    // ===== SIMULAÇÃO AUTOMÁTICA DE PROGRESSO =====
    function startMissionProgressSimulation() {
        // Simula progresso gradual nas missões em andamento
        const activeMissions = document.querySelectorAll('.mission-active');
        
        activeMissions.forEach(mission => {
            const progressBar = mission.querySelector('.progress-bar');
            const progressLabel = mission.querySelector('.progress-label');
            const progressPercentage = mission.querySelector('.progress-percentage');
            
            if (progressBar && !mission.dataset.simulated) {
                mission.dataset.simulated = 'true';
                
                setInterval(() => {
                    const currentWidth = parseInt(progressBar.style.width) || 67;
                    
                    // Chance de 20% de progredir a cada 30 segundos
                    if (Math.random() < 0.2 && currentWidth < 100) {
                        const increment = Math.floor(Math.random() * 3) + 1; // 1-3% de progresso
                        const newWidth = Math.min(currentWidth + increment, 100);
                        
                        progressBar.style.width = newWidth + '%';
                        progressLabel.textContent = `Progresso: ${Math.floor(newWidth)}/100 unidades`;
                        progressPercentage.textContent = newWidth + '%';
                        
                        // Se chegou a 100%, completa a missão
                        if (newWidth >= 100) {
                            setTimeout(() => {
                                completeMission(mission);
                            }, 1000);
                        }
                    }
                }, 30000); // Verifica a cada 30 segundos
            }
        });
    }

    // ===== FUNÇÃO DE TESTE PARA COMPLETAR MISSÃO RAPIDAMENTE =====
    function testMissionCompletion() {
        const activeMission = document.querySelector('.mission-active');
        if (activeMission) {
            const progressBar = activeMission.querySelector('.progress-bar');
            if (progressBar) {
                // Anima até 100%
                let currentProgress = parseInt(progressBar.style.width) || 67;
                const targetProgress = 100;
                const increment = 2;
                
                const animateProgress = setInterval(() => {
                    currentProgress += increment;
                    if (currentProgress >= targetProgress) {
                        currentProgress = targetProgress;
                        clearInterval(animateProgress);
                        
                        // Completa a missão após a animação
                        setTimeout(() => {
                            completeMission(activeMission);
                        }, 500);
                    }
                    
                    progressBar.style.width = currentProgress + '%';
                    activeMission.querySelector('.progress-label').textContent = `Progresso: ${currentProgress}/100 unidades`;
                    activeMission.querySelector('.progress-percentage').textContent = currentProgress + '%';
                }, 100);
            }
        }
    }

    // ===== INICIALIZAÇÃO =====
    initMissionFilters();
    initMissionActions();
    initRewardTabs();
    initRewardActions();
    initTooltips();
    updateProgressBars();
    
    // Inicializa animações na seção ativa (métricas por padrão)
    setTimeout(() => {
        animateMetrics();
    }, 500);
    
    // Inicia simulação de progresso das missões
    setTimeout(() => {
        startMissionProgressSimulation();
    }, 2000);
    
    // Inicializa conquistas quando a aba for carregada
    setTimeout(() => {
        if (document.getElementById('conquistas')) {
            initAchievements();
        }
    }, 1000);
    
    // Adiciona estilo para missão boosted
    const style = document.createElement('style');
    style.textContent = `
        .mission-boosted {
            border-color: #ffd700 !important;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.3) !important;
        }
        
        .mission-boosted .mission-badge {
            background: linear-gradient(45deg, #ffd700, #ff6b35) !important;
            animation: pulse 1.5s infinite !important;
        }
    `;
    document.head.appendChild(style);

    console.log('🚀 Sistema Swift completo carregado com sucesso!');

    // ===== EXPÕE FUNÇÕES GLOBAIS =====
    window.downloadQR = downloadQR;
    window.testMissionCompletion = testMissionCompletion;
    
    // Função de teste para demonstrar os modais (pode ser removida em produção)
    window.testModals = function() {
        console.log('🧪 Testando sistema de modais...');
        
        // Teste modal simples
        setTimeout(() => {
            showSwiftModal({
                icon: '🎉',
                title: 'Sistema de Modais',
                type: 'success',
                content: '<p>✅ Sistema de modais personalizados funcionando perfeitamente!</p><p>Todos os alerts foram substituídos por modais interativos e visuais.</p>',
                showCancel: false,
                confirmText: 'Perfeito!',
                confirmClass: 'btn-success'
            });
        }, 1000);
    };
    
    // Função para testar completar missão rapidamente
    window.testCompleteNow = function() {
        console.log('🧪 Testando conclusão de missão...');
        testMissionCompletion();
    };

    // ===== FUNCIONALIDADE CATEGORIAS DE CONQUISTAS =====
    const categoryButtons = document.querySelectorAll('.achievements-categories .btn');
    const achievementCards = document.querySelectorAll('.achievement-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Atualizar botão ativo
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar conquistas
            achievementCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ===== ANIMAÇÕES DE HOVER PARA RECOMPENSAS =====
    const rewardCards = document.querySelectorAll('.reward-card');
    rewardCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('reward-claimed')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== EFEITO DE BRILHO NAS RECOMPENSAS PREMIUM =====
    const premiumCards = document.querySelectorAll('.reward-premium');
    premiumCards.forEach(card => {
        setInterval(() => {
            const glow = card.querySelector('.premium-glow');
            if (glow) {
                glow.style.backgroundPosition = glow.style.backgroundPosition === '200% 0' ? '-200% 0' : '200% 0';
            }
        }, 2000);
    });

    // ===== FUNCIONALIDADE FILTROS DE RANKING =====
    const rankingFilters = document.querySelectorAll('.ranking-filters .btn');
    rankingFilters.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Atualizar botão ativo
            rankingFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Simular mudança de dados (em um caso real, faria uma requisição à API)
            updateRankingData(filter);
        });
    });

    // ===== ANIMAÇÃO DE ENTRADA DOS CARDS DE RANKING =====
    const rankingCards = document.querySelectorAll('.ranking-card');
    rankingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // ===== EFEITO HOVER NO PÓDIO =====
    const podiumPositions = document.querySelectorAll('.podium-position');
    podiumPositions.forEach(position => {
        position.addEventListener('mouseenter', function() {
            this.style.transform += ' translateY(-10px)';
        });
        
        position.addEventListener('mouseleave', function() {
            if (this.classList.contains('first')) {
                this.style.transform = 'scale(1.1)';
            } else {
                this.style.transform = 'scale(1)';
            }
        });
    });
});

// ===== FUNÇÃO PARA ATUALIZAR DADOS DO RANKING =====
function updateRankingData(filter) {
    console.log(`🔄 Atualizando ranking para: ${filter}`);
    
    // Simular dados diferentes para cada filtro
    const rankingData = {
        nacional: {
            title: '🇧🇷 RANKING NACIONAL',
            description: 'Descubra onde você está entre os melhores funcionários do Brasil!'
        },
        regional: {
            title: '🏙️ RANKING REGIONAL - SUDESTE',
            description: 'Sua posição entre os funcionários da região Sudeste!'
        },
        loja: {
            title: '🏪 RANKING DA LOJA - RJ Centro',
            description: 'Veja sua classificação na loja do Rio de Janeiro - Centro!'
        },
        mensal: {
            title: '📅 RANKING MENSAL - OUTUBRO',
            description: 'Performance dos funcionários no mês de outubro!'
        },
        semanal: {
            title: '⚡ RANKING SEMANAL',
            description: 'Classificação da semana atual - corrida acirrada!'
        }
    };
    
    const data = rankingData[filter];
    if (data) {
        // Atualizar título e descrição
        const header = document.querySelector('#rankings .content-header h1');
        const description = document.querySelector('#rankings .content-header p');
        
        if (header) {
            header.textContent = data.title;
            header.style.animation = 'fadeIn 0.5s ease-in-out';
        }
        
        if (description) {
            description.textContent = data.description;
        }
        
        // Efeito visual de carregamento
        const rankingCards = document.querySelectorAll('.ranking-card, .podium-position');
        rankingCards.forEach((card, index) => {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50 * index);
        });
        
        // Mostrar modal informativo
        setTimeout(() => {
            showSwiftModal({
                icon: '📊',
                title: 'Ranking Atualizado!',
                type: 'info',
                content: `<p>✅ Dados do <strong>${data.title}</strong> atualizados com sucesso!</p><p>🔄 Rankings são atualizados a cada 15 minutos.</p>`,
                showCancel: false,
                confirmText: 'Entendi',
                confirmClass: 'btn-info'
            });
        }, 1000);
    }
}

// ===== FUNÇÃO PARA CARREGAR MAIS POSIÇÕES =====
function loadMoreRankings() {
    const loadMoreBtn = document.querySelector('.ranking-load-more .btn');
    const rankingList = document.querySelector('.ranking-list');
    
    if (loadMoreBtn && rankingList) {
        loadMoreBtn.textContent = '⏳ Carregando...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // Simular carregamento de mais posições
            const newPositions = `
                <div class="ranking-card position-9">
                    <div class="rank-number">9</div>
                    <div class="player-avatar">
                        <img src="https://i.pravatar.cc/80?img=9" alt="Patricia Oliveira">
                    </div>
                    <div class="player-info">
                        <div class="player-name">Patricia Oliveira</div>
                        <div class="player-location">📍 Brasília, DF</div>
                    </div>
                    <div class="player-stats">
                        <div class="rating">1210</div>
                        <div class="tier-badge silver">🥈 PRATA</div>
                    </div>
                    <div class="player-metrics">
                        <div class="metric">
                            <span class="metric-value">91.5%</span>
                            <span class="metric-label">Aprovação</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">6</span>
                            <span class="metric-label">Conquistas</span>
                        </div>
                    </div>
                    <div class="trend trend-up">↗️ +2</div>
                </div>
                
                <div class="ranking-card position-10">
                    <div class="rank-number">10</div>
                    <div class="player-avatar">
                        <img src="https://i.pravatar.cc/80?img=10" alt="Lucas Rodrigues">
                    </div>
                    <div class="player-info">
                        <div class="player-name">Lucas Rodrigues</div>
                        <div class="player-location">📍 Recife, PE</div>
                    </div>
                    <div class="player-stats">
                        <div class="rating">1200</div>
                        <div class="tier-badge silver">🥈 PRATA</div>
                    </div>
                    <div class="player-metrics">
                        <div class="metric">
                            <span class="metric-value">90.8%</span>
                            <span class="metric-label">Aprovação</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">5</span>
                            <span class="metric-label">Conquistas</span>
                        </div>
                    </div>
                    <div class="trend trend-down">↘️ -1</div>
                </div>
            `;
            
            // Inserir antes do botão "Ver Mais"
            const loadMoreSection = document.querySelector('.ranking-load-more');
            loadMoreSection.insertAdjacentHTML('beforebegin', newPositions);
            
            // Animar entrada das novas posições
            const newCards = rankingList.querySelectorAll('.ranking-card:nth-last-child(-n+2)');
            newCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            });
            
            loadMoreBtn.textContent = '📊 Ver Mais Posições';
            loadMoreBtn.disabled = false;
        }, 1500);
    }
}

// ===== EXPOR FUNÇÃO GLOBALMENTE =====
window.loadMoreRankings = loadMoreRankings;

// ===== FUNÇÃO DE LOGOUT =====
function logout() {
    showSwiftModal({
        icon: '👋',
        title: 'Sair da Conta',
        type: 'warning',
        content: '<p>Tem certeza que deseja sair da sua conta?</p>',
        showCancel: true,
        confirmText: 'Sim, Sair',
        cancelText: 'Cancelar',
        confirmClass: 'btn-warning',
        onConfirm: function() {
            // Remover dados de sessão
            sessionStorage.removeItem('swiftLoggedIn');
            // Redirecionar para login
            window.location.href = 'login.html';
        }
    });
}