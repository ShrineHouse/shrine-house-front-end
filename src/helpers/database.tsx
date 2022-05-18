import Moralis from "moralis/types";
import BeatPack from "../interfaces/beats";
import DbUser from "../interfaces/users";

export function dataToUsers(users: Moralis.Object<Moralis.Attributes>[]) {
    let convertedUsers: DbUser[] = [];
    users.map(u => convertedUsers.push(u.attributes as DbUser));
    return convertedUsers;
}

export function dataToShrineUsers(users: Moralis.Object<Moralis.Attributes>[]) {

    let convertedUsers: DbUser[] = [];
    users.map(u => {
        if ((u.attributes as DbUser).verified) { convertedUsers.push(u.attributes as DbUser) }
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
    const max = [sort[0], sort[1], sort[2]]
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
