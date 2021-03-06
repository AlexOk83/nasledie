export default {
    state: {
        view: false,
        text: "",
        typeModal: null,
        onConfirm: null,
        onSuccess: null
    },
    mutations: {
        viewModals(state, payload) {
            state.view = true;
            state.text = payload.text;
            state.typeModal = payload.typeModal;
            state.onConfirm = payload.onConfirm;
            state.onSuccess = payload.onSuccess;
        },
        hideModals(state) {
            state.view = false;
            state.text = "";
            state.typeModal = null;
            state.onConfirm = null;
        }
    },
    actions: {
        showModal({commit}, payload) {
            commit('viewModals', {
                text: payload
            })
        },
        showModalConfirm({commit}, payload) {
            commit('viewModals', {
                text: payload.text,
                onConfirm: payload.onConfirm,
                typeModal: 'confirm'
            })
        },
        showModalSuccess({commit}, payload) {
            commit('viewModals', {
                text: payload.text,
                typeModal: 'success',
                onSuccess: payload.onSuccess
            })
        },
        showModalAddPoint({commit}, payload) {
            commit('viewModals', {
                typeModal: 'map',
                ...payload
            })
        },
        hideModal({commit}, payload) {
            commit('hideModals', payload)
        }
    },
    getters: {
        view (state) {
            return state.view;
        },
        text (state) {
            return state.text;
        },
        onConfirm (state) {
            return state.onConfirm;
        },
        onSuccess (state) {
            return state.onSuccess;
        },
        typeModal (state) {
            return state.typeModal;
        }
    }
}
