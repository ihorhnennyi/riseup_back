"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSourceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_source_dto_1 = require("./create-source.dto");
class UpdateSourceDto extends (0, swagger_1.PartialType)(create_source_dto_1.CreateSourceDto) {
}
exports.UpdateSourceDto = UpdateSourceDto;
//# sourceMappingURL=update-source.dto.js.map