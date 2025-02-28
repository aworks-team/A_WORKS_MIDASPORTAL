const UserRoles = {
    ADMIN: 'Administrator',
    TEAM: 'Team Member',
    CUSTOMER: 'Customer'
};

class UserManager {
    constructor() {
        // Initialize users if not exists
        if (!localStorage.getItem('users')) {
            // Create default admin account
            const defaultAdmin = {
                email: 'admin@midas.com',
                password: 'admin123', // In production, use proper password hashing
                role: UserRoles.ADMIN,
                name: 'System Admin',
                created: new Date().toISOString()
            };
            localStorage.setItem('users', JSON.stringify([defaultAdmin]));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    getCurrentUser() {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            const { password, ...safeUser } = user; // Remove password from session data
            localStorage.setItem('currentUser', JSON.stringify(safeUser));
            return safeUser;
        }
        throw new Error('Invalid email or password');
    }

    register(email, password, role = UserRoles.CUSTOMER) {
        const users = this.getUsers();
        if (users.some(u => u.email === email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            email,
            password,
            role,
            created: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return this.login(email, password);
    }

    updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.email === updatedUser.email);
        
        if (index === -1) {
            throw new Error('User not found');
        }

        // Preserve the password and other fields
        const existingUser = users[index];
        users[index] = { ...existingUser, ...updatedUser };
        
        // Update localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user session if it's the same user
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.email === updatedUser.email) {
            const { password, ...safeUser } = users[index]; // Remove password from session data
            localStorage.setItem('currentUser', JSON.stringify(safeUser));
        }

        return users[index];
    }

    updateUserRole(email, newRole) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.email === email);
        
        if (index === -1) {
            throw new Error('User not found');
        }

        users[index].role = newRole;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user session if it's the same user
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.email === email) {
            const { password, ...safeUser } = users[index];
            localStorage.setItem('currentUser', JSON.stringify(safeUser));
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    hasPermission(requiredRole) {
        const user = this.getCurrentUser();
        if (!user) return false;

        switch (user.role) {
            case UserRoles.ADMIN:
                return true; // Admin can access everything
            case UserRoles.TEAM:
                return requiredRole !== UserRoles.ADMIN;
            case UserRoles.CUSTOMER:
                return requiredRole === UserRoles.CUSTOMER;
            default:
                return false;
        }
    }
}

export const userManager = new UserManager();
export { UserRoles }; 