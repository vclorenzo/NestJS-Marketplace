// // date.scalar.ts

// import { Scalar } from '@nestjs/graphql';
// import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
// import { parse, isDate } from 'date-fns';

// @Scalar('Date', () => Date)
// export class DateScalar {
//   description = 'Date custom scalar type';

//   parseValue(value: string): Date {
//     const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
//     if (isDate(parsedDate)) {
//       return parsedDate;
//     }
//     throw new TypeError('Invalid date format');
//   }

//   serialize(value: Date): string {
//     return value.toISOString();
//   }

//   parseLiteral(ast: ValueNode): Date | null {
//     if (ast.kind === Kind.STRING) {
//       const parsedDate = parse(ast.value, 'yyyy-MM-dd', new Date());
//       if (isDate(parsedDate)) {
//         return parsedDate;
//       }
//     }
//     return null;
//   }
// }
