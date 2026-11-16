import { Observable } from 'rxjs';

export class IbAvatarStoreService {
    public getAvatar (): Observable<any> {
        throw new Error('IbAvatarStoreService mock must be configured by the test');
    }

    public deleteAvatarURL (): void {
        throw new Error('IbAvatarStoreService mock must be configured by the test');
    }
}

export class IbCUserStoreRepositoryService {
    public getUserState (): Observable<any> {
        throw new Error('IbCUserStoreRepositoryService mock must be configured by the test');
    }
}
