<template>
    <div class="mentions-legales">
        <h1>Mentions Légales</h1>
        <p>Dernière mise à jour : 17 Septembre 2024</p>

        <section>
            <h2>Informations Légales</h2>
            <p>
                Responsable de la publication : Thibault Yvard
            </p>
        </section>

        <section>
            <h2>Hébergement</h2>
            <p>
                Le site est hébergé par : <br />
                Nom de l'hébergeur : Contabo <br />
                Adresse de l'hébergeur : contabo.com
            </p>
        </section>

        <section>
            <h2>Protection des Données Personnelles</h2>
            <p>
                Conformément à la loi "Informatique et Libertés", vous disposez d'un droit d'accès, de rectification, et
                de suppression de vos données personnelles. Pour exercer ce droit, veuillez nous contacter à l'adresse
                suivante : thibaultyvard01@gmail.com.
            </p>
        </section>

        <section>
            <h2>Conditions d'Utilisation</h2>
            <p>
                En accédant à ce site, vous acceptez les présentes conditions d'utilisation. Nous nous réservons le
                droit de les modifier à tout moment.
            </p>
        </section>
    </div>
</template>

<script>
export default {
    name: "MentionsLegales",
};
</script>

<style scoped>
.mentions-legales {
    padding: 20px;
    line-height: 1.6;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

h2 {
    font-size: 1.5rem;
    margin-top: 1.5rem;
}

p {
    margin-bottom: 1rem;
}
</style>