document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os links de navegação de AMBOS os menus (desktop e mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            // Lógica para remover a classe 'active'
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Adiciona 'active' ao link clicado (nos dois menus, se existir)
            const targetId = this.getAttribute('data-target');
            document.querySelectorAll(`.nav-link[data-target="${targetId}"]`).forEach(matchingLink => {
                matchingLink.classList.add('active');
            });
            
            // Mostra a seção de conteúdo correta
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});