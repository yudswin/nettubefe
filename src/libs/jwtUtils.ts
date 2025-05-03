import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface ITokenPayload extends JwtPayload {
    email: string;
    role: string;
}

export const decodeToken = (token: string): ITokenPayload | null => {
    try {
        return jwtDecode<ITokenPayload>(token);
    } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
    }
};