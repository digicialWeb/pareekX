const TOKEN_KEY = "token";
const ROLE_KEY = "userRole";
const USER_KEY = "user";
const USERS_KEY = "pareekx_users";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getRole = () => {
  const role = localStorage.getItem(ROLE_KEY);
  return role ? role.toUpperCase() : null;
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getToken() && getRole());

export const setSession = (user, role) => {
  localStorage.setItem(TOKEN_KEY, `demo-token-${Date.now()}`);
  localStorage.setItem(ROLE_KEY, role.toUpperCase());
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, role: role.toUpperCase() }));
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveUser = (user) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUser = (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();

  const demoUsers = [
    {
      id: "admin-1",
      name: "Pareek Admin",
      email: "admin@pareekx.com",
      password: "admin123",
      role: "ADMIN",
    },
    {
      id: "dealer-1",
      name: "Demo Dealer",
      email: "dealer@pareekx.com",
      password: "dealer123",
      role: "DEALER",
    },
    {
      id: "salesperson-1",
      name: "Demo Salesperson",
      email: "salesperson@pareekx.com",
      password: "sales123",
      role: "SALESPERSON",
    },
  ];

  const user = [...demoUsers, ...getStoredUsers()].find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password
  );

  return user || null;
};
