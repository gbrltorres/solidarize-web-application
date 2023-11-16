import { Ngo } from '../models/Ngo.js';
import userRepository from '../repositories/userRepository.js'
import userValidationSchema from './validators/userValidator.js';

export const createUser = async (userData) => {
    try {
        const errorResponse = await validateUserData(userData)
        if (errorResponse) {
            return errorResponse;
        }

        if (userData.isManager) {
            userData.ngo = new Ngo();
        }

        await userRepository.create(userData);
        return { message: 'Usuário criado com sucesso.', status: 200 };
    } catch (ex) {
        return { message: ex.message, status: 502 };
    }
};

const validateUserData = async (userData) => {
    const { error } = userValidationSchema.validate(userData);
    if (error) {
        return { message: error.details[0].message, status: 400 };
    }

    const userExists = await userRepository.findByEmail(userData.email);
    if (userExists) {
        return { message: 'O e-mail fornecido já está em uso.', status: 400 };
    }
};

export default {
    createUser
};