import { Config } from "../models/config.model";

export const getConfigKey = async (key: string) => {
    const config = await Config.findOne({key});
    if (!config) {
        console.log(
        "Locals Error",
        `The key ${key} provided is invalid. Please pass the valid key`
        );
    }    
    return config?.value;
}