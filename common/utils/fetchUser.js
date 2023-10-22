"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUser = void 0;
var Role_1 = require("../types/enums/Role");
var Types_1 = require("../types/Types");
var Types_2 = require("../types/Types");
function fetchUser() {
    var user = {
        userId: '1',
        role: Role_1.Role.Student,
        username: 'Liam',
        firstName: 'Liam',
        lastName: 'Heaver',
        dateOfBirth: new Date(1963, 1, 24),
        email: 'example@example.com',
        mobile: '0400000000',
        rank: { belt: Types_1.Belt.White, stripes: Types_2.Stripes.Four }
    };
    return user;
}
exports.fetchUser = fetchUser;
