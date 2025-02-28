import { userManager, UserRoles } from '../userManager.js';

function updateInitials(name) {
    const initials = name.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    const initialsElement = document.getElementById('profileInitials');
    if (initialsElement) {
        initialsElement.textContent = initials;
    }
}

function displayUserList() {
    const currentUser = userManager.getCurrentUser();
    
    // Only show user list for administrators
    const userListContainer = document.getElementById('userListContainer');
    if (!userListContainer) return;
    
    if (currentUser.role !== UserRoles.ADMIN) {
        userListContainer.style.display = 'none';
        return;
    }

    const users = userManager.getUsers();
    const userListHtml = users.map(user => `
        <div class="user-card">
            <div class="user-info">
                <div class="user-avatar small">${user.name ? user.name[0].toUpperCase() : 'U'}</div>
                <div class="user-details">
                    <h3>${user.name || 'Unnamed User'}</h3>
                    <span class="user-email">${user.email}</span>
                    <small class="user-created">Created: ${new Date(user.created).toLocaleDateString()}</small>
                </div>
            </div>
            <select class="role-select" onchange="updateUserRole('${user.email}', this.value)" 
                    ${user.email === currentUser.email ? 'disabled' : ''}>
                ${Object.values(UserRoles).map(role => `
                    <option value="${role}" ${user.role === role ? 'selected' : ''}>
                        ${role}
                    </option>
                `).join('')}
            </select>
        </div>
    `).join('');
    
    document.getElementById('userList').innerHTML = userListHtml;
}

export function initializeAccount() {
    // Check authentication first
    const user = userManager.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Get form elements
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const profileName = document.getElementById('profileName');
    const profileForm = document.getElementById('profileForm');

    // Only proceed if we found all elements
    if (fullNameInput && emailInput && profileName && profileForm) {
        // Populate form with current user data
        fullNameInput.value = user.name || '';
        emailInput.value = user.email || '';
        profileName.textContent = user.name || 'User';
        updateInitials(user.name || 'User');

        // Handle form submission
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedUser = {
                ...user,
                name: fullNameInput.value,
                email: emailInput.value
            };

            try {
                await userManager.updateUser(updatedUser);
                // Update display
                profileName.textContent = updatedUser.name;
                updateInitials(updatedUser.name);
                
                // Show success message
                alert('Profile updated successfully');
                
                // Refresh the page to show updated info
                window.location.reload();
            } catch (error) {
                alert('Failed to update profile: ' + error.message);
            }
        });
    }
}

// Make these functions available globally
window.updateUserRole = function(email, newRole) {
    try {
        userManager.updateUserRole(email, newRole);
        displayUserList();
    } catch (error) {
        alert(error.message);
    }
};

window.displayUserList = displayUserList; 