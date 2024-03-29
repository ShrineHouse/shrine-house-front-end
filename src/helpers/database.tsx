import Moralis from "moralis/types";
import BeatPack from "../interfaces/beats";
import { Muse } from "../interfaces/muse";
import { DbUser } from "../interfaces/users";

export function dataToUsers(users: Moralis.Object<Moralis.Attributes>[]) {
    let convertedUsers: DbUser[] = [];
    users.map(u => {
        const user: DbUser = u.attributes as any;
        const addId: DbUser = { ...user, id: u.id };
        convertedUsers.push(addId)
    });
    return convertedUsers;
}

export function dataToMuses(muses: Moralis.Object<Moralis.Attributes>[]) {
    let convertedMuses: Muse[] = [];
    muses.map(u => {
        const user: Muse = u.attributes as any;
        const addId: Muse = { ...user, id: u.id, createdAt: u.createdAt };
        convertedMuses.push(addId)

    });
    return convertedMuses;
}
export function dataToMuse(muses: Moralis.Object<Moralis.Attributes>[]) {
    let convertedMuses: Muse[] = [];
    muses.map(u => {
        const user: Muse = u.attributes as any;
        const addId: Muse = { ...user, id: u.id, createdAt: u.createdAt };
        convertedMuses.push(addId)

    });
    return convertedMuses[0];
}

export function dataToUser(users: Moralis.Object<Moralis.Attributes>[]) {
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
    beatpacks.map((u) => {
        const bp: BeatPack = u.attributes as any;
        const addId: BeatPack = { ...bp, objectId: u.id };

        convertedPacks.push(addId)
    }
    )

    return convertedPacks;
}

export function dataToBeatpackPage(beatpacks: Moralis.Object<Moralis.Attributes>[]) {
    let convertedPacks: BeatPack[] = [];
    beatpacks.map((u) => {
        const bp: BeatPack = u.attributes as any;
        const addId: BeatPack = { ...bp, objectId: u.id };

        convertedPacks.push(addId)
    })
    return convertedPacks[0];
}
export function dataToBeatPackRec(beatpacks: Moralis.Object<Moralis.Attributes>[]) {

    let convertedPacks: BeatPack[] = [];
    beatpacks.map((u) => {
        const bp: BeatPack = u.attributes as any;
        const addId: BeatPack = { ...bp, objectId: u.id };

        convertedPacks.push(addId)
    })
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

export function searchMuse(muses: Muse[], searchResult: string) {
    let result: Muse[] = [];
    muses.map(u => {
        if (u.nftName.toLowerCase().includes(searchResult.toLowerCase())) return result.push(u);
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