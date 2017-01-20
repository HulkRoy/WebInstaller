import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Application } from './application';
import { APPLICATIONS } from './mock-applications';
import { Manifest } from '../manifest';

@Injectable()
export class ApplicationService {
    private applicationsApi: string = Manifest.apiUrl + '/applications';
    private postApplicationApi: string = Manifest.apiUrl + '/application';

    constructor(private http: Http) {}

    public getApplications(): Promise<Application[]> {
        return this.http.get(this.applicationsApi)
                    .toPromise()
                    .then(response => {
                        let data = response.json();
                        let applicationsList: Application[] = [];
                        data.map(e => {
                            let app: Application = {
                                id: e.id || e._id,
                                name: e.name || e.Name,
                                description: e.description || e.Description,
                                version: e.version || e.Version,
                                message: e.message || e.Message,
                                script: e.script || e.Script,
                                quitCode: e.quitCode || e.QuitCode,
                                dependency: e.dependency || e.Dependency,
                                createDate: e.createDate || e.CreateDate,
                                sourceURL: e.sourceURL || e.SourceURL,
                                publisher: e.publisher || e.Publisher,
                                downloadSize: e.downloadSize || e.DownloadSize,
                                icon: e.icon || e.Icon,
                                like: e.like || e.Like,
                                restart: e.restart || e.Restart,
                                passive: e.passive || e.Passive,
                                quiet: e.quiet || e.Quiet,
                                supportedOS: e.supportedOS || e.SupportedOS
                            };

                            applicationsList.push(app);
                        });

                        return applicationsList;
                    })
                    .catch(this.handleError);
    }

    public modifyApplication(app: Application) {
        let applicationId = app.id;
        let url = this.applicationsApi + applicationId;
        return this.http.put(url, app)
            .toPromise()
            .then(response => {
                console.log(response);
            })
            .catch(this.handleError);
    }

    public deleteApplication(appId: string) {
        let url = this.applicationsApi + appId;
        return this.http.delete(url)
            .toPromise()
            .then(response => {
                console.log(response);
            })
            .catch(this.handleError);
    }

    public addApplication(app: Application) {
        let url = this.postApplicationApi;
        return this.http.post(url, app)
            .toPromise()
            .then(response => {
                console.log(response);
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
