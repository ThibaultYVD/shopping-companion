<template>
    <div class="background">
        <div class="main-container">
            <div class="group">
                <h1>{{ group.group_name }}</h1>
                <p>Créé par {{ group.first_name }} {{ group.last_name }} le {{ formatDate(group.creation_date) }}</p>

                <div v-if="isGroupCreator" class="admin-buttons">
                    <button @click="editGroupName" class="edit-button">Modifier le nom du groupe</button>
                    <button @click="createInvitation" class="invitation-button">Créer un code d'invitation</button>
                    <button @click="deleteGroup" class="delete-button">Supprimer le groupe</button>
                </div>

                <div v-if="isGroupMember" class="members-buttons">
                    <button @click="leaveGroup" class="leave-button">Quitter le groupe</button>
                </div>
            </div>
            <div class="lists">
                <h1>Listes du groupe</h1>
                <div v-if="lists.length > 0" class="lists-container">
                    <div v-for="list in displayedLists" :key="list.list_id" class="list-card">
                        <h3>{{ list.list_name }}</h3>
                        <p>Date de course prévu: {{ formatDate(list.shopping_date) }}</p>
                        <p>{{ list.supermarket_name }}</p>
                        <button @click="goToListPage(list.list_id)" class="list-button">Voir la liste</button>
                    </div>
                </div>
                <div v-else>
                    <p>Il n'y a aucune liste dans ce groupe. Commencez par en créer une !</p>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isEditing" class="edit-modal">
        <div class="modal-content">
            <h2>Modifier le nom du groupe</h2>
            <input v-model="newGroupName" placeholder="Nouveau nom du groupe" />
            <button @click="saveGroupName">Enregistrer</button>
            <button @click="cancelEdit">Annuler</button>
        </div>
    </div>

    <div v-if="isCreatingInvit" class="invitation-modal">
        <div class="modal-content">
            <h2>Votre code d'invitation:</h2>
            <input :value=invitation_code class="invitation-code" readonly>
            <p>Envoyez ce code à la personne de votre choix.</p>
            <button @click="closeInvitationCode">Fermer</button>
        </div>
    </div>

</template>

<script>
import { instance as axios } from '../services/axios';
import { useRouter } from 'vue-router';

export default {
    name: 'Group',
    data() {
        return {
            group: {},
            lists: [],
            userId: null,
            isEditing: false,
            isCreatingInvit: false,
            newGroupName: '',
            invitation_code: null
        };
    },
    computed: {
        isGroupCreator() {
            return this.userId === this.group.user_id;
        },
        isGroupMember() {
            return this.userId !== this.group.user_id;
        }
    },
    mounted() {
        this.groupId = this.$route.params.groupId;
        this.getUserIdFromToken();
        this.getGroup(this.groupId);
        this.getLists(this.groupId);
    },
    methods: {
        getUserIdFromToken() {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.userId = payload.id;
            }
        },
        async getGroup(groupId) {
            try {
                const response = await axios.get(`/user/groups/${groupId}`);
                this.group = response.data[0];
            } catch (error) {
                console.error('Error fetching group:', error);
                this.$router.push('/dashboard');
            }
        },
        async getLists(groupId) {
            try {
                const response = await axios.get(`/user/lists/${groupId}`);
                this.lists = response.data.map(list => ({
                    ...list,
                    item_count: Math.floor(Math.random() * 20)
                }));
                this.displayedLists = this.lists.slice(0, 9);
            } catch (error) {
                console.error('Error fetching lists:', error);

            }
        },
        goToListPage(listId) {
            const router = useRouter();
            this.$router.push(`/group/${this.groupId}/list/${listId}`);
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('fr-FR', options);
        },
        editGroupName() {
            this.isEditing = true;
            this.newGroupName = this.group.group_name;
        },
        async createInvitation() {
            const response = await axios.patch(`/user/groups/createInvit/${this.groupId}`);
            console.log(response.data.invitation_code)
            this.invitation_code = response.data.invitation_code
            this.isCreatingInvit = true;
        },
        async deleteGroup() {
            const isConfirmed = confirm("Voulez-vous vraiment supprimer ce groupe ?\nCette action est irréversible.");

            if (isConfirmed) {
                try {
                    await axios.delete(`/user/groups/${this.groupId}`);
                    this.$router.push('/dashboard');
                } catch (error) {
                    console.error('Error deleting group:', error);
                    alert("Une erreur est survenue lors de la suppression du groupe.");
                }
            }
        },
        async leaveGroup() {
            const isConfirmed = confirm("Voulez-vous vraiment quitter ce groupe ?\nVous devrez obtenir une nouvelle invitation pour y retourner.");

            if (isConfirmed) {
                try {
                    console.log(this.groupId)
                    await axios.delete(`/user/users/leavegroup/${this.groupId}`);

                    this.$router.push('/dashboard');
                } catch (error) {
                    console.error('Error deleting group:', error);
                    alert("Une erreur est survenue lors de la suppression du groupe.");
                }
            }
        },
        async saveGroupName() {
            try {
                await axios.patch(`/user/groups/${this.groupId}`, { group_name: this.newGroupName });
                this.group.group_name = this.newGroupName;
                this.isEditing = false;
            } catch (error) {
                console.error('Error updating group name:', error);
            }
        },
        cancelEdit() {
            this.isEditing = false;
        },
        closeInvitationCode() {
            this.isCreatingInvit = false;
        }
    }
};
</script>

<style scoped>
.background {
    height: 100vh;
    margin: 0;
    background-color: white;
}

.main-container {
    display: flex;
    padding-top: 50px;
}

.group {
    width: 50%;
    padding-left: 3rem;
}

.group h1 {
    margin-top: 20px;
    margin-bottom: 10px;
}

.group p {
    margin: 0;
    padding: 0;
    margin-bottom: 20px;
    font-size: 16px;
}

.admin-buttons {
    display: flex;
    flex-wrap: wrap;

}

.edit-button,
.invitation-button,
.delete-button,
.leave-button {
    margin-right: 10px;
    padding: 10px 20px;
    background-color: white;
    color: black;
    border: solid 2px #2C7C45;
    border-radius: 5px;
    cursor: pointer;
}

.edit-button:hover,
.invitation-button:hover,
.delete-button:hover,
.leave-button:hover {
    background-color: #2C7C45;
    color: white
}

.lists {
    width: 50%;
}

.lists h1 {
    margin-top: 20px;
}

.lists-container {
    width: 100%;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
}

.list-card {
    background: white;
    padding: 1rem;
    margin: 1rem;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.30) 0px 0px 10px 0px;
    border: solid 2px #2C7C45;
}

.list-card h3 {
    margin: 0 0 0.5rem 0;
    font-weight: bold;
}

.list-card p {
    margin: 0.2rem 0;
}

.list-button {
    width: 100%;
    padding: 5px;
    background-color: white;
    border: solid 2px #2C7C45;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 10px;
    font-size: 15px;
    font-weight: 400;
}

.list-button:hover {
    background: #2C7C45;
    color: white;
}

.edit-modal,
.invitation-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    border: solid 2px #2C7C45;
    box-shadow: #0000004d 0px 0px 10px 0px;
    z-index: 1000;
}

.modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-content h2 {
    margin-bottom: 15px;
}

.modal-content input {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    width: 100%;
}

.modal-content button {
    width: 100%;
    padding: 10px;
    background-color: #2C7C45;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.modal-content button:hover {
    background-color: #2C7C45;
    color: white;
}

.invitation-modal p {
    margin-top: 10px;
    margin-bottom: 10px;
}


.invitation-code {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 25px !important;
    letter-spacing: 0.1cm;
    font-weight: bold;
    background-color: #f9f9f9;
    text-align: center;
}

.invitation-code:focus {
    border: 1px solid #2C7C45;
}
</style>