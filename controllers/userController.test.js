import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockUsersService = {
  getUserByEmail: jest.fn(),
  isPasswordValid: jest.fn(),
  createUserToken: jest.fn(),
};

jest.unstable_mockModule("../services/userService.js", () => ({
  default: mockUsersService,
}));

jest.unstable_mockModule("../helpers/HttpError.js", () => ({
  default: jest.fn((status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
  }),
}));

jest.unstable_mockModule("../helpers/ctrlWrapper.js", () => ({
  ctrlWrapper: (fn) => fn,
}));

const { default: userController } = await import("./userController.js");
const { loginUser } = userController;

describe("loginUser controller", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("should return status 200 on successful login", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      subscription: "starter",
      password: "hashedPassword",
    };

    const mockToken = "mock.jwt.token";

    mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
    mockUsersService.isPasswordValid.mockResolvedValue(true);
    mockUsersService.createUserToken.mockResolvedValue(mockToken);

    await loginUser(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      token: mockToken,
      user: {
        email: mockUser.email,
        subscription: mockUser.subscription,
      },
    });
  });

  test("should return token in response", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      subscription: "starter",
      password: "hashedPassword",
    };

    const mockToken = "mock.jwt.token";

    mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
    mockUsersService.isPasswordValid.mockResolvedValue(true);
    mockUsersService.createUserToken.mockResolvedValue(mockToken);

    await loginUser(req, res, next);

    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData).toHaveProperty("token");
    expect(responseData.token).toBe(mockToken);
  });

  test("should return user object with email and subscription fields of type String", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      subscription: "starter",
      password: "hashedPassword",
    };

    const mockToken = "mock.jwt.token";

    mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
    mockUsersService.isPasswordValid.mockResolvedValue(true);
    mockUsersService.createUserToken.mockResolvedValue(mockToken);

    await loginUser(req, res, next);

    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];

    expect(responseData).toHaveProperty("user");
    expect(responseData.user).toBeInstanceOf(Object);
    expect(Object.keys(responseData.user)).toEqual(["email", "subscription"]);
    expect(typeof responseData.user.email).toBe("string");
    expect(typeof responseData.user.subscription).toBe("string");
    expect(responseData.user.email).toBe(mockUser.email);
    expect(responseData.user.subscription).toBe(mockUser.subscription);
  });
});

