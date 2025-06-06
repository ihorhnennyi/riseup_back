"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitySchema = exports.City = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
let City = class City {
};
exports.City = City;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], City.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40.7128 }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], City.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -74.0060 }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], City.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], City.prototype, "isActive", void 0);
exports.City = City = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
    })
], City);
exports.CitySchema = mongoose_1.SchemaFactory.createForClass(City);
//# sourceMappingURL=city.schema.js.map