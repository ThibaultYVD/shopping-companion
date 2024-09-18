<template>
    <div class="background">
        <Spacing />
        <div class="main-container">
            <div class="group-container">
                <CustomTitleSeparator :title="group.group_name" :buttons="groupButtons" />
                <p>Créé par {{ group.first_name }} {{ group.last_name }} le {{ formatDate(group.creation_date) }}</p>
            </div>

            <div class="center-container">
                <div class="member-container">
                    <TitleSeparator title="Membres" :buttons="memberButtons" />
                    <div v-if="members.length > 0" class="members">
                        <div class="member" v-for="member in displayedMembers" :key="member.user_id">
                            <div class="member-name">
                                <p>{{ member.first_name }}</p>
                                <p>{{ member.last_name }}</p>
                            </div>
                            <div class="joined-at">
                                <p>A rejoint le {{ formatDate(member.joined_at) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="list-container">
                    <TitleSeparator title="Listes" :buttons="listButtons" />
                    <div v-if="lists.length > 0" class="lists">
                        <Card v-for="list in displayedLists" :key="list.list_id" :title="list.list_name"
                            :groupName="list.group_name" :shoppingDate="list.shopping_date"
                            :supermarketName="list.supermarket_name" :listId="list.list_id" :groupId="list.group_id"
                            buttonText="Voir la liste" @go-to-list="() => goToListPage(list.list_id, list.group_id)" />
                    </div>
                    <div v-else>
                        <p>Il n'y a aucune liste dans ce groupe. Commencez par en créer une !</p>
                    </div>
                </div>
            </div>
        </div>
        <Spacing />
    </div>


    <Modal :visible="isEditing" title="Modifier le nom du groupe" :actions="actionsEdit" @close="cancelEdit">
        <template v-slot:body>
            <input v-model="newGroupName" class="modal-input" placeholder="Nouveau nom du groupe" />
        </template>
    </Modal>


    <div v-if="isCreatingInvit" class="invitation-modal">
        <div class="modal-content">
            <h2>Votre code d'invitation:</h2>
            <input :value=invitation_code class="invitation-code" readonly>
            <p>Envoyez ce code à la personne de votre choix.</p>
            <button @click="closeInvitationCode">Fermer</button>
        </div>
    </div>

    <Modal :visible="isCreating" title="Nommez votre liste" :actions="actionsCreate" @close="cancelListCreate">
        <template v-slot:body>
            <input v-model="list_name" placeholder="Nom de la liste" />
            <input v-model="shopping_date" placeholder="yyyy-mm-dd" />
            <select v-model="selectedSupermarket">
                <option v-for="supermarket in supermarkets" :key="supermarket.supermarket_id"
                    :value="supermarket.supermarket_id">
                    {{ supermarket.supermarket_name }}
                </option>
            </select>
        </template>
    </Modal>

</template>

<script>
import { instance as axios } from '../services/axios';
import { useRouter } from 'vue-router';
import CustomTitleSeparator from '@/components/CustomTitleSeparator.vue';
import TitleSeparator from '@/components/TitleSeparator.vue';
import Spacing from '@/components/Spacing.vue';
import Card from '@/components/Card.vue';
import Modal from '@/components/Modal.vue';

export default {
    name: 'Group',
    components: {
        CustomTitleSeparator,
        TitleSeparator,
        Spacing,
        Card,
        Modal
    },
    data() {
        return {
            group: {},
            lists: [],
            members: [],
            supermarkets: [],
            userId: null,
            isEditing: false,
            isCreatingInvit: false,
            isCreating: false,
            newGroupName: '',
            selectedSupermarket: null,
            list_name: null,
            shopping_date:null,
            invitation_code: null,
            listButtons: [
                { label: "Créer", action: this.createList }
            ],
            memberButtons: [
                { label: "Inviter", action: this.createInvitation }
            ],
            actionsEdit: [
                { label: 'Enregistrer', handler: this.saveGroupName }
            ],
            actionsCreate: [
                { label: 'Enregistrer', handler: this.submitList }
            ],
        };
    },
    computed: {
        isGroupCreator() {
            return this.userId === this.group.user_id;
        },
        isGroupMember() {
            return this.userId !== this.group.user_id;
        },
        groupButtons() {
            const buttons = []
            if (this.isGroupCreator) {
                buttons.push(
                    { label: '', action: this.editGroupName, icon:"fa-solid fa-pen-to-square" },
                    { label: "", action: this.deleteGroup, icon:"fa-solid fa-trash"},
                )
            }
            if (this.isGroupMember) {
                buttons.push(
                    { label: '', action: this.leaveGroup, class: 'leave-button', icon:"fa-solid fa-right-from-bracket" }
                );
            }
            return buttons
        }
    },
    mounted() {
        this.groupId = this.$route.params.groupId;
        this.getUserIdFromToken();
        this.getGroup(this.groupId);
        this.getLists(this.groupId);
        this.getMembers(this.groupId)
        this.getSupermarkets()
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
        async getSupermarkets() {
            try {
                const response = await axios.get(`/user/supermarkets/`);
                this.supermarkets = response.data.map(supermarket => ({
                    ...supermarket
                }));
                this.displayedSupermarkets = this.supermarkets
            } catch (error) {
                console.error('Error fetching supermarket:', error);
            }
        },
        async getMembers(groupId) {
            try {
                const response = await axios.get(`/user/groups/groupmembers/${groupId}`);
                this.members = response.data.map(member => ({
                    ...member
                }));
                this.displayedMembers = this.members
            } catch (error) {
                console.error('Error fetching members:', error);
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
                //console.error('Error fetching lists:', error);

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
        },
        createList() {
            this.isCreating = true;
        },
        cancelListCreate() {
            this.isCreating = false;
        },
        async submitList() {
            try {
                const response = await axios.post(`/user/lists/${this.groupId}`, { list_name: this.list_name, shopping_date: this.shopping_date, supermarket_id: this.selectedSupermarket });
                this.isCreating = false;
                this.$router.push(`/group/${this.groupId}/list/${response.data.list_id}`);

            } catch (error) {
                console.error('Error creating list:', error);
                alert('Une erreur est survenue lors de la création de la liste.');
            }
        },
    }
};
</script>

<style scoped>
.background {
    margin: 0;
    background-color: white;
    display: flex;
}

.main-container {
    width: 70%;
}

.center-container {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    background: rgb(241, 238, 238);
    box-shadow: #0000004d 0px 0px 10px 0px;
    border-radius: 30px;
    box-sizing: border-box;
}

.member-container {
    width: 40%;
    padding: 10px;
    border-right: grey solid 2px;
}

.list-container {
    padding: 10px;
    width: 60%;
}

.lists {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    margin-top: 10px;
}

.lists .card {
    flex-basis: calc(50% - 10px);
    box-sizing: border-box;
}

.group-container p {
    padding: 10px;
}

.edit-modal,
.create-modal,
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


.members {
    padding: 5px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.member {
    padding-left: 5px;
    background-color: white;
    box-shadow: #0000004d 0px 0px 10px 0px;
    margin-bottom: 10px;
    border-radius: 10px;
    width: 100%;
    height: 20%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

}

.member-name {
    width: 50%;
    display: flex;
    gap: 10px;
}

.joined-at {
    width: 50%;
    font-size: 12px;
    font-style: italic;
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


.create-list-button {
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

.create-list-button:hover {
    background: #2C7C45;
    color: white;
}

.create-group-button {
    margin-top: 20px;
    border: 2px solid #2C7C45;
    background-color: white;
    width: 50%;
    padding: 15px;
}

.create-group-container {
    display: flexbox;
    justify-content: center;
    margin-top: 20px;
}

@media (max-width:1444px) {
    .main-container {
        width: 80%;
    }
}

@media (max-width:1244px) {
    .modal {
        width: 50%;
    }

    .main-container {
        width: 90%;
    }

    .member {
        height: 30%;
    }
}

@media (max-width: 768px) {

    .main-container {
        width: 100%;
    }

    .center-container {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-end;
        margin-left: auto;
        margin-right: auto;
        width: 90%;
    }

    .members {
        padding: 5px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .member {
        padding-left: 5px;
        background-color: white;
        box-shadow: #0000004d 0px 0px 10px 0px;
        margin-bottom: 10px;
        border-radius: 10px;
        width: 100%;
        height: 25%;

    }

    .lists {
        display: flex;
        flex-direction: column;
    }

    .list-container {
        width: 100%;
    }

    .lists .card {
        width: 100%;
    }

    .member-container {
        width: 100%;
        border: none;
    }
}
</style>