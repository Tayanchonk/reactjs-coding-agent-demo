import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Permission {
    menuId: string;
    menuName: string;
    isCreate: boolean;
    isRead: boolean;
    isUpdate: boolean;
    isDelete: boolean;
    moduleUrl: string;
    url: string;
    menuParentId: string;
}

interface PermissionMenuState {
    permission: Permission;
}


const initialState: PermissionMenuState = {
    permission: {
        menuId: '',
        menuName: '',
        isCreate: false,
        isRead: false,
        isUpdate: false,
        isDelete: false,
        moduleUrl: '',
        url: '',
        menuParentId: ''
    },
};

const permissionMenuSlice = createSlice({
    name: 'permissionMenu',
    initialState,
    reducers: {
        setPermissionMenu: (state, action: PayloadAction<Permission>) => {
            state.permission = action.payload;
        },
    },
});

export const { setPermissionMenu } = permissionMenuSlice.actions;
export default permissionMenuSlice.reducer;
