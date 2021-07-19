import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBGHdy4jQM7kaVneI5TiEzupmJ-4htjbis",
    authDomain: "abobestellung-kfru.firebaseapp.com",
    projectId: "abobestellung-kfru",
    storageBucket: "abobestellung-kfru.appspot.com",
    messagingSenderId: "228261219425",
    appId: "1:228261219425:web:e8ce90dffd59b34e672e20"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
        const {email} = user;
        try {
            await userRef.set({
                email,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
}

const getUserDocument = async uid => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();
        return {
            uid,
            ...userDocument.data()
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
}

export const updateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (snapshot.exists) {
        try {
            await userRef.update({
                ...additionalData
            });
        } catch (error) {
            console.error("Error updating user document", error);
        }
    } else {
        console.error("No User available to update");
        return;
    }
    return getUserDocument(user.uid);
}

export const deleteUserDocument = async (user) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (snapshot.exists) {
        try {
            await userRef.delete();
        } catch (error) {
            console.error("Error delete user document", error);
        }
    } else {
        console.error("No User available to delete");
        return;
    }
    return getUserDocument(user.uid);
}

export const generateAboDocument = async (data) => {
    const aboCol = firestore.collection(`abos`);

    aboCol.add(data)
        .then((aboRef) => {
            return getAboDocument(aboRef)
        })
        .catch((error) => {
            console.error("Error adding document: ", error)
        })
}

export const updateAboDocument = async (aboId, data) => {
    if (!aboId) return;
    const aboRef = firestore.doc(`abos/${aboId}`);
    const snapshot = await aboRef.get();
    if (snapshot.exists) {
        try {
            await aboRef.update({
                ...data
            });
        } catch (error) {
            console.error("Error updating abo document", error);
        }
    } else {
        console.error("No Abo available to update");
        return;
    }
    return getAboDocument(aboId);
}

const getAboDocument = async aboRef => {
    if (!aboRef) return null;
    try {
        const aboDocument = await firestore.doc(`abos/${aboRef}`).get();
        return {
            aboRef,
            ...aboDocument.data()
        };
    } catch (error) {
        console.error("Error fetching abo", error);
    }
}

export const getAllAbosForUserDocument = (userUid) => {
    return new Promise((resolved, rejected) => {
        if (!userUid) rejected("UserID not provided");
        firestore.collection(`abos`).where("userId", "==", userUid).get()
            .then((querySnapshot) => {
                let aboArray = []
                querySnapshot.forEach((doc) => {
                   aboArray.push({aboId: doc.id, ...doc.data()})
                });
                resolved(aboArray)
            })
            .catch((error) => {
                rejected(error)
            })
    })
}