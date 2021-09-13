import {DefaultCrudRepository, Entity, Filter} from '@loopback/repository';
import { ArrayReponse as ArrayReponseInft } from '@shared/util/array-resp';

export class FBOBaseRepository<T extends Entity, ID, Relations extends Record<never, unknown>>
  extends DefaultCrudRepository<
  T,
  ID,
  Relations
> {


    distinct = async(column: string, filter?: Filter):Promise<ArrayReponseInft> => {

      const aggregates: Array<Record<string, unknown>> = [];
      const match:Record<string, unknown> = { };

      if (filter && filter.where) {

        const where2 = filter.where as any;
        const keys = Object.keys(where2);
        for (const columnName of keys) {

          const details = where2[columnName];
          const conditions:Record<string, string> = {};
          if (!details.like || typeof details.like !== 'string') {

            return {data: []};

          }

          conditions.$regex = details.like;
          if (details.options) {

            conditions.$options = details.options;

          }
          match[columnName] = conditions;

        }

      }
      aggregates.push({$match: match});
      aggregates.push({ $group: { _id: `$${column}` } });
      const gnamesP = await this.execute(this.modelClass.modelName, 'aggregate', aggregates);
      const gnames:[{_id: string}] = await gnamesP.toArray();
      const data = gnames.map((gname) => gname._id);
      return {data};

    }

}
