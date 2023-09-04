<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>
                    {{ mode=== 'LOGIN' ? 'LOGIN' : 'SIGN UP' }}
                </ion-title>
            </ion-toolbar>

        </ion-header>
        <ion-content style="padding: 32px;" class="ion-padding">
            <ion-item v-if="mode === 'SIGNUP'">
                <ion-input type="text" v-model="displayName" label="Name"></ion-input>
            </ion-item>

            <ion-item>
                <ion-input type="email" v-model="email" label="Email"></ion-input>
            </ion-item>

            <ion-item>
                <ion-input type="password" v-model="password" label="Password"></ion-input>
            </ion-item>

            <ion-button @click="emits('on-action', {email, password, displayName})">
                {{ mode === "SIGNUP" ? 'SIGNUP' : 'LOGIN' }}
            </ion-button>

            <ion-button @click="emits('on-dismiss')">CANCEL</ion-button>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonModal, IonInput, IonItem } from '@ionic/vue';

// handle incoming props
const props = defineProps<{
    mode: "LOGIN" | "SIGNUP";
}>();

// handle events
const emits = defineEmits<{
    (event: "on-dismiss"): void;
    (
        event: "on-action",
        {
            email,
            password,
            displayName,
        } : {email :string; password: string; displayName?: string}
    ): void;
}>();

// values from modal
const email = ref('');
const password = ref('');
const displayName = ref('');

</script>