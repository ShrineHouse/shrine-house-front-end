import Moralis from "moralis/types";
import { off } from "process";
import BeatPack from "../interfaces/beats";
import { DbUser } from "../interfaces/users";

export function dataToUsers(users: Moralis.Object<Moralis.Attributes>[]) {
    let convertedUsers: DbUser[] = [];
    console.log(users)
    users.map(u => {
        const user: DbUser = u.attributes as any;
        const addId: DbUser = { ...user, id: u.id };

        convertedUsers.push(addId)
    });
    return convertedUsers;
}

export function dataToUser(users: Moralis.Object<Moralis.Attributes>[]) {
    console.log('users')
    console.log(users)
    let convertedUsers: DbUser[] = [];
    users.map(u => {
        const user: DbUser = u.attributes as any;
        const addId: DbUser = { ...user, id: u.id };

        convertedUsers.push(addId)
    });
    return convertedUsers[0];
}

export function dataToShrineUsers(users: Moralis.Object<Moralis.Attributes>[]) {
    let convertedUsers: DbUser[] = [];
    users.map(u => {
        if ((u.attributes as DbUser).verified) {
            users.map(u => {
                const user: DbUser = u.attributes as any;
                const addId: DbUser = { ...user, id: u.id };

                convertedUsers.push(addId)
            });
        }
    });
    return convertedUsers;

}

export function dataToBeatPack(beatpacks: Moralis.Object<Moralis.Attributes>[]) {
    let convertedPacks: BeatPack[] = [];
    beatpacks.map(u => convertedPacks.push(u.attributes as BeatPack));
    return convertedPacks;
}
export function dataToBeatPackRec(beatpacks: Moralis.Object<Moralis.Attributes>[]) {

    let convertedPacks: BeatPack[] = [];
    beatpacks.map(u => convertedPacks.push(u.attributes as BeatPack));
    const sort = convertedPacks.slice().sort((a, b) => b.downloads - a.downloads)
    let max = [sort[0], sort[1], sort[2]]
    max = max.filter(function (element) {
        return element !== undefined;
    });
    return max;
}

export function dataBeatpackFilter(beatpacks: BeatPack[], genre: string) {

    const genres: BeatPack[] = []
    beatpacks.forEach((bp) => {
        if (bp.genre === genre) {
            genres.push(bp)
        }
    })
    return genres;
}

export function searchArtists(users: DbUser[], searchResult: string) {
    let result: DbUser[] = [];
    console.log(searchResult)
    users.map(u => {
        if (u.fullName.toLowerCase().includes(searchResult.toLowerCase())) return result.push(u);
    })
    return result;
}

export function searchBeatpack(beatpacks: BeatPack[], searchResult: string) {
    let result: BeatPack[] = [];
    beatpacks.map(u => {
        if (u.beatPackName.toLowerCase().includes(searchResult.toLowerCase())) return result.push(u);
    })
    return result;
}

export function artistGenreFilter(users: DbUser[], genre: string) {
    const genres: DbUser[] = []
    users.forEach((u) => {
        if (u.genre === genre) {
            genres.push(u)
        }
    })
    return genres;
}

export function convertBase64(file: any) {
    console.log("file")
    console.log(file)
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            resolve(fileReader.result);
        }
        fileReader.onerror = (error) => {
            reject(error);
        }
    })
}

export function getGenres(genres: Moralis.Object<Moralis.Attributes>[]) {
    let dataGenres: string[] = [];

    genres.map((u) => dataGenres = u.attributes.genres);

    return dataGenres;

}