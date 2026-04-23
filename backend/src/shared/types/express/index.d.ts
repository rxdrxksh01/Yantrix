import { UserEntity } from "../../../core/entities/User.entity.ts";
declare global {
    namespace Express {
        interface Request {
            user?: UserEntity;
        }
    }
}