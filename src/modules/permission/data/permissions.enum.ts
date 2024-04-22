export const PermissionSet = {
    USER: {
        VIEW: {
            NAME: 'View',
            PERMISSION: 'view-user'
        },
        CREATE: {
            NAME: 'Create',
            PERMISSION: 'create-user'
        },
        EDIT: {
            NAME: 'Edit',
            PERMISSION: 'edit-user'
        },
        DELETE: {
            NAME: 'Delete',
            PERMISSION: 'delete-user'
        }
    },
    ROLE: {
        VIEW: {
            NAME: 'View',
            PERMISSION: 'view-role'
        },
        CREATE: {
            NAME: 'Create',
            PERMISSION: 'create-role'
        },
        EDIT: {
            NAME: 'Edit',
            PERMISSION: 'edit-role'
        },
        DELETE: {
            NAME: 'Delete',
            PERMISSION: 'delete-role'
        }
    }
} as const
