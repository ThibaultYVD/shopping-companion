<!-- src/components/Footer.vue -->
<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="legal-mentions">
                <p><router-link to="/">Mentions légales</router-link></p>
            </div>
            <div class="author">
                <p>Made by Thibault Yvard - 2024</p>
            </div>

            <div class="social-media">
                <a href="https://thibault-yvard.fr" target="_blank" rel="noopener noreferrer" class="social-icon">
                    <i class="fa-solid fa-globe"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-icon">
                    <i class="fa-brands fa-github"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-icon">
                    <i class="fa-brands fa-linkedin"></i>
                </a>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
};
</script>

<style scoped>
.footer {
    width: 100%;
    background-color: #2C7C45;
    box-shadow: inset 0px -30px 40px 7px rgba(0, 0, 0, 0.1);
    color: white;
    text-align: center;
}

.footer-content {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto;
}


.legal-mentions a {

    color: white;
}

.social-media {
    display: flex;
}

.social-media .social-icon {
    color: white;
    margin: 0 10px;
    font-size: 25px;
    text-decoration: none;
}

@media (max-width: 768px) {
    .footer-content{
        flex-direction: column;
        gap:10px
    }
    .social-media .social-icon {
        margin: 0 5px;
    }
}
</style>