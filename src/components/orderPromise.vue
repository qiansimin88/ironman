<template>
    <div>
        <Row type="flex" style="margin-bottom: 12px;">
            <Col span="12">
                交付时间：{{ promiseDto.deliverTime && $utils.tranDateTime(promiseDto.deliverTime) || '--' }}
            </Col>
            <Col span="12">
                标注公差：{{ promiseDto.markTolerance || '--' }}
            </Col>
        </Row>
        <Row type="flex" style="margin-bottom: 12px;">
            <Col span="12">
                未标注公差：{{ promiseDto.notMarkTolerance || '--' }}
            </Col>
            <Col span="12">
                力学性能测试要求：{{ promiseDto.powerPerformanceRequirement || '--' }}
            </Col>
        </Row>
        <Row type="flex" style="margin-bottom: 12px;">
            <Col span="12">
                其他性能测试要求：{{ promiseDto.otherPerformanceRequirement || '--' }}
            </Col>
            <Col span="12">
                其他性能要求：{{ promiseDto.otherRequirement || '--' }}
            </Col>
        </Row>
        <Row type="flex" style="margin-bottom: 12px;">
            <Col span="12">
                粗糙度要求：{{ promiseDto.roughnessRequirement || '--' }}
            </Col>
            <Col span="12">
                表面处理要求：{{ promiseDto.surfacingRequirement || '--' }}
            </Col>
        </Row>
        <Row type="flex" style="margin-bottom: 12px;">
            <Col span="12">
                其他表面质量要求：{{ promiseDto.otherSurfacingRequirement || '--' }}
            </Col>
            <Col span="12">
                热处理要求：{{ promiseDto.hotDisposeRequirement || '--' }}
            </Col>
        </Row>
        <Row type="flex" style="margin-bottom: 12px;">
            <Col span="12">
                特殊后处理要求：{{ promiseDto.specialAfterDisposeRequirement || '--' }}
            </Col>
            <Col span="12">
                附件信息：{{ promiseDto.specialAfterDisposeRequirement || '--' }}
            </Col>
        </Row>
    </div>
</template>
<script>
import { orderTypes } from '@/constant';

export default {
    name: 'orderPromise',
    props: {
        // detailObj: Object,
        promiseDto: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
        };
    },
    computed: {
    },
    watch: {
    },
    mounted() {
    },
    methods: {
    }
};
</script>
<style lang="less" scoped>
</style>
