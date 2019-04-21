import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryRef: AngularFireList<any>;
  constructor(private db: AngularFireDatabase) { }

  getAll(): Observable<any[]> {
    this.categoryRef = this.db.list('/categories');
    return this.categoryRef.snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() }))
        })
      )

  }
}
