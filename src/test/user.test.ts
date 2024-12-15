import { User } from "../models/users.model";
import request from "supertest";
import express from "express";
import { config } from "dotenv";
import routes from "../routes";

config();

const app = express();
app.use(express.json());
app.use("/api", routes);

jest.mock('../models/users.model', () => ({
    User: {
        find: jest.fn(),
        countDocuments: jest.fn(),
    },
}));

describe("fetchUsers", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch users with valid search parameter", async () => {
        const mockUsers = [
            {
                _id: "123",
                id: "539add62-fcf1-43e4-a888-187a79abceb1",
                gender: "female",
                name: "Manon Dufour",
                address: {
                    city: "Dunkerque",
                    state: "Guadeloupe",
                    country: "France",
                    street: "Rue Louis-Blanqui",
                },
                email: "manon.dufour@example.com",
                age: "39",
                picture: "https://randomuser.me/api/portraits/women/43.jpg",
                createdAt: "2024-12-15T14:17:40.018Z",
            },
        ];

        (User.find as jest.Mock).mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockUsers), 
        });

        (User.countDocuments as jest.Mock).mockResolvedValue(mockUsers.length);
        const res = await request(app)
            .get("/api/user")
            .query({ limit: 1, page: 1, sort: "createdAt" });
        expect(res.status).toBe(200);
        expect(res.body.totalNoOfUsers).toBe(1); 
        expect(res.body.user).toHaveLength(1);   
        expect(res.body.page).toBe(1);
    });
});
