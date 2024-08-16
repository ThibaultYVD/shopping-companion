<template>
    <div class="background">
        <div class="main-container">
            <div class="list">
                <h1>{{ list.list_name }}</h1>

                <div v-if="isGroupCreator" class="admin-buttons">
                    <button @click="editGroupName" class="edit-button">Modifier le nom du groupe</button>
                    <button @click="createInvitation" class="invitation-button">Créer un code d'invitation</button>
                    <button @click="deleteGroup" class="invitation-button">Supprimer le groupe</button>
                </div>

                <div v-if="isGroupMember" class="members-buttons">
                    <button @click="leaveGroup" class="leave-button">Quitter le groupe</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { instance as axios } from '../services/axios';
import { useRouter } from 'vue-router';

export default {
    name: 'List',
    data() {
        return {
            list: [],
            userId: null,
            isEditing: false,
            newListName: '',
            invitation_code: null
        };
    },
    computed: {
        /*
        isGroupCreator() {
            return this.userId === this.group.user_id;
        },
        isGroupMember() {
            return this.userId !== this.group.user_id;
        }
            */
    },
    mounted() {
        this.groupId = this.$route.params.groupId;
        this.listId = this.$route.params.listId;
        this.getUserIdFromToken();
        /*
        this.getGroup(this.groupId);
        */
        this.getList(this.groupId, this.listId);
        
    },
    methods: {
        getUserIdFromToken() {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.userId = payload.id;
            }
        },
        async getList(groupId, listId) {
            try {
                const response = await axios.get(`/user/lists/${groupId}/${listId}`);
                this.list = response.data[0];
            } catch (error) {
                console.error('Error fetching lists:', error);

            }
        },
        
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

.list {
    width: 50%;
    padding-left: 3rem;
}

.list h1 {
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