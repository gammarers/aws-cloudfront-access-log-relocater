# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CloudFrontAccessLogRelocater <a name="CloudFrontAccessLogRelocater" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater"></a>

#### Initializers <a name="Initializers" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.Initializer"></a>

```typescript
import { CloudFrontAccessLogRelocater } from '@gammarers/aws-cloudfront-access-log-relocater'

new CloudFrontAccessLogRelocater(scope: Construct, id: string, props: CloudFrontAccessLogRelocaterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.Initializer.parameter.props">props</a></code> | <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocaterProps">CloudFrontAccessLogRelocaterProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.Initializer.parameter.props"></a>

- *Type:* <a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocaterProps">CloudFrontAccessLogRelocaterProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.isConstruct"></a>

```typescript
import { CloudFrontAccessLogRelocater } from '@gammarers/aws-cloudfront-access-log-relocater'

CloudFrontAccessLogRelocater.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocater.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### AccessLogDestination <a name="AccessLogDestination" id="@gammarers/aws-cloudfront-access-log-relocater.AccessLogDestination"></a>

#### Initializer <a name="Initializer" id="@gammarers/aws-cloudfront-access-log-relocater.AccessLogDestination.Initializer"></a>

```typescript
import { AccessLogDestination } from '@gammarers/aws-cloudfront-access-log-relocater'

const accessLogDestination: AccessLogDestination = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.AccessLogDestination.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.AccessLogDestination.property.objectPrefix">objectPrefix</a></code> | <code>string</code> | *No description.* |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@gammarers/aws-cloudfront-access-log-relocater.AccessLogDestination.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `objectPrefix`<sup>Required</sup> <a name="objectPrefix" id="@gammarers/aws-cloudfront-access-log-relocater.AccessLogDestination.property.objectPrefix"></a>

```typescript
public readonly objectPrefix: string;
```

- *Type:* string

---

### AccessLogSource <a name="AccessLogSource" id="@gammarers/aws-cloudfront-access-log-relocater.AccessLogSource"></a>

#### Initializer <a name="Initializer" id="@gammarers/aws-cloudfront-access-log-relocater.AccessLogSource.Initializer"></a>

```typescript
import { AccessLogSource } from '@gammarers/aws-cloudfront-access-log-relocater'

const accessLogSource: AccessLogSource = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.AccessLogSource.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.AccessLogSource.property.objectPrefix">objectPrefix</a></code> | <code>string</code> | *No description.* |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@gammarers/aws-cloudfront-access-log-relocater.AccessLogSource.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `objectPrefix`<sup>Required</sup> <a name="objectPrefix" id="@gammarers/aws-cloudfront-access-log-relocater.AccessLogSource.property.objectPrefix"></a>

```typescript
public readonly objectPrefix: string;
```

- *Type:* string

---

### CloudFrontAccessLogRelocaterProps <a name="CloudFrontAccessLogRelocaterProps" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocaterProps"></a>

#### Initializer <a name="Initializer" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocaterProps.Initializer"></a>

```typescript
import { CloudFrontAccessLogRelocaterProps } from '@gammarers/aws-cloudfront-access-log-relocater'

const cloudFrontAccessLogRelocaterProps: CloudFrontAccessLogRelocaterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocaterProps.property.accessLogDestination">accessLogDestination</a></code> | <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.AccessLogDestination">AccessLogDestination</a></code> | *No description.* |
| <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocaterProps.property.accessLogSource">accessLogSource</a></code> | <code><a href="#@gammarers/aws-cloudfront-access-log-relocater.AccessLogSource">AccessLogSource</a></code> | *No description.* |

---

##### `accessLogDestination`<sup>Required</sup> <a name="accessLogDestination" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocaterProps.property.accessLogDestination"></a>

```typescript
public readonly accessLogDestination: AccessLogDestination;
```

- *Type:* <a href="#@gammarers/aws-cloudfront-access-log-relocater.AccessLogDestination">AccessLogDestination</a>

---

##### `accessLogSource`<sup>Required</sup> <a name="accessLogSource" id="@gammarers/aws-cloudfront-access-log-relocater.CloudFrontAccessLogRelocaterProps.property.accessLogSource"></a>

```typescript
public readonly accessLogSource: AccessLogSource;
```

- *Type:* <a href="#@gammarers/aws-cloudfront-access-log-relocater.AccessLogSource">AccessLogSource</a>

---



